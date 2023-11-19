import BadgeModel from "../model/badgeModel.js";
import mongoose from "mongoose";
import ClientModel from "../model/clientModel.js";
import BookingModel from "../model/bookingModel.js";
import BadgeRecordModel from "../model/badgeRecordModel.js";
import { s3GetImages } from "../service/s3ImageServices.js";
import {
   NotificationAction,
   NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { Role } from "../util/roleEnum.js";
import { createNotification } from "./notificationController.js";
import sendMail from "../util/sendMail.js";
import { clientBadgeMailOptions } from "../util/sendMailOptions.js";

const sendBadgeNotification = async (clientId, badgeRecord, session) => {
   try {
      const notificationReq = {
         senderRole: Role.ADMIN,
         recipientRole: Role.CLIENT,
         recipient: clientId,
         notificationEvent: NotificationEvent.NEWBADGE,
         notificationAction: NotificationAction.APPROVE,
         eventId: badgeRecord._id,
         eventObj: badgeRecord,
      };
      await createNotification(notificationReq, session);
   } catch (err) {
      console.log(err);
      throw err;
   }
};

const sendBadgeMail = async (client, badgeRecord, imageUrl) => {
   try {
      const options = clientBadgeMailOptions(client, badgeRecord, imageUrl[0]);
      await sendMail(options);
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const badgeExists = async (name, session) => {
   const oldBadge = await BadgeModel.findOne({ name }).session(session);
   return !!oldBadge;
};

// create badge endpoint
export const createBadge = async (req, res) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const { ...newBadge } = req.body;
      const fileBody = req.files;
      fileBody.image[0].location;
      let fileS3Location;
      if (!fileBody?.image || fileBody?.image?.length === 0) {
         console.log("No image files uploaded");
      } else {
         console.log("Retrieving uploaded images url");
         fileS3Location = fileBody.image[0].location;
      }

      const badgeNameExists = await badgeExists(newBadge.name, session);
      if (badgeNameExists) {
         await session.abortTransaction();
         session.endSession();
         return res.status(409).json({
            errors: [{ msg: "Badge Name already exists!" }],
         });
      }
      const preSignedImage = await s3GetImages([fileS3Location]);
      const newBadgeCreated = await BadgeModel.create(
         [{ ...newBadge, badgeImage: fileS3Location }],
         {
            session: session,
         }
      );
      const createdBadge = await newBadgeCreated[0].save();

      const imagesPathArr = [];

      if (!fileBody?.images || fileBody?.images?.length === 0) {
         console.log("Badge image descriptions: No image files uploaded");
      } else {
         let fileArray = fileBody.images,
            fileLocation;
         for (let i = 0; i < fileArray.length; i++) {
            fileLocation = fileArray[i].location;
            imagesPathArr.push(fileLocation);
         }
      }

      const updatedBadge = await BadgeModel.findByIdAndUpdate(
         createdBadge._id,
         { images: imagesPathArr },
         { new: true, session }
      );

      // Upon successful creation of badge, create a corresponding badge record for each client
      const clients = await ClientModel.find({ status: "APPROVED" }).session(
         session
      );

      for (const client of clients) {
         const clientId = client._id;
         const completedStatuses = ["PENDING_PAYMENT", "PAID"];

         const query = {
            status: {
               $in: completedStatuses,
            },
            clientId: clientId,
         };

         const completedBookings = await BookingModel.find(query)
            .session(session)
            .populate("activityId");

         console.log(completedBookings.length);

         const sdgSet = new Set();

         completedBookings.forEach((booking) => {
            if (booking.activityId && booking.activityId.sdg) {
               booking.activityId.sdg.forEach((sdg) => {
                  sdgSet.add(sdg);
               });
            }
         });

         console.log(sdgSet);

         if (
            createdBadge.sdgBadgeType === "GOLD" ||
            createdBadge.sdgBadgeType === "SILVER"
         ) {
            if (createdBadge.sdgThreshold) {
               const newBadgeRecord = await BadgeRecordModel.create(
                  [
                     {
                        badge: createdBadge,
                        client: client,
                        isCompleted: sdgSet.size >= createdBadge.sdgThreshold,
                        sdgCount: sdgSet.size,
                     },
                  ],
                  {
                     session: session,
                  }
               );

               const createdBadgeRecord = await newBadgeRecord[0].save({
                  session,
               });

               if (createdBadgeRecord.isCompleted) {
                  await sendBadgeNotification(
                     clientId,
                     createdBadgeRecord,
                     session
                  );
                  await sendBadgeMail(
                     client,
                     createdBadgeRecord,
                     preSignedImage
                  );
               }
            } else {
               await session.abortTransaction();
               session.endSession();
               return res.status(403).json({
                  status: "error",
                  msg: "No SDG Threshold for Gold/Silver badge!",
               });
            }
         } else if (createdBadge.sdgBadgeType === "BRONZE") {
            if (createdBadge.sdg) {
               let isCompleted = false;

               if (sdgSet.has(createdBadge.sdg)) {
                  isCompleted = true;
               }
               const newBadgeRecord = await BadgeRecordModel.create(
                  [
                     {
                        badge: createdBadge,
                        client: client,
                        isCompleted: isCompleted,
                     },
                  ],
                  {
                     session: session,
                  }
               );

               const createdBadgeRecord = await newBadgeRecord[0].save({
                  session,
               });

               if (isCompleted) {
                  await sendBadgeNotification(
                     clientId,
                     createdBadgeRecord,
                     session
                  );
                  await sendBadgeMail(
                     client,
                     createdBadgeRecord,
                     preSignedImage
                  );
               }
            } else {
               await session.abortTransaction();
               session.endSession();
               return res
                  .status(403)
                  .json({ status: "error", msg: "No SDG for Bronze badge!" });
            }
         } else if (createdBadge.sdgBadgeType === "OTHER") {
            const completedBookingsCount = completedBookings.length;
            if (createdBadge.bookingThreshold) {
               const newBadgeRecord = await BadgeRecordModel.create(
                  [
                     {
                        badge: createdBadge,
                        client: client,
                        isCompleted:
                           completedBookingsCount >
                           createdBadge.bookingThreshold,
                        bookingCount: completedBookingsCount,
                     },
                  ],
                  { session: session }
               );
               const createdBadgeRecord = await newBadgeRecord[0].save({
                  session,
               });
               if (createdBadgeRecord.isCompleted) {
                  await sendBadgeNotification(
                     clientId,
                     createdBadgeRecord,
                     session
                  );
                  await sendBadgeMail(
                     client,
                     createdBadgeRecord,
                     preSignedImage
                  );
               }
            } else {
               await session.abortTransaction();
               session.endSession();
               return res
                  .status(403)
                  .json({ status: "error", msg: "No SDG for Bronze badge!" });
            }
         }
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
         message: "Badge and user badge records are successfully created!",
         badge: updatedBadge,
      });
   } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err.message);
      return res.status(500).json({ status: "error", msg: "Server Error" });
   }
};

// Update badge endpoint
export const updateBadge = async (req, res) => {
   try {
      const {
         // remove attributes that should not be updated
         sdgBadgeType,
         nonSdgBadgeType,
         sdg,
         sdgThreshold,
         bookingThreshold,
         ...updatedBadgeData
      } = req.body;
      const badgeId = req.params.id;

      const updatedBadge = await BadgeModel.findByIdAndUpdate(
         badgeId,
         updatedBadgeData,
         { new: true, runValidators: true }
      );

      if (!updatedBadge) {
         return res.status(404).json({
            errors: [{ msg: "Badge not found!" }],
         });
      }

      res.status(200).json({
         message: "Badge successfully updated!",
         badge: updatedBadge,
      });
   } catch (err) {
      return res.status(500).json({ status: "error", msg: "Server Error" });
   }
};

export const getAllBadges = async (req, res) => {
  try {
    let badges = [];
    badges = await BadgeModel.find();

    for (const badge of badges) {
      const badgePreSignedImage = await s3GetImages(badge.badgeImage);
      badge.badgePreSignedImage = badgePreSignedImage;
    }
    res.status(200).json({
      message: "Badge successfully retrieved!",
      badges: badges,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};

export const deleteBadgeAndBadgeRecords = async (req, res) => {
  try {
    if (req.params.id === undefined) {
      return res.status(400).json({
        msg: "Params is undefined!",
      });
    }
    // Find the badge by ID
    const badge = await BadgeModel.findById(req.params.id);

    if (!badge) {
      return res.status(400).json({
        message: "Badge does not exist!",
        badge: badge,
      });
    }
    // Find and delete badge records associated with the badge
    await BadgeRecordModel.deleteMany({ badge: req.params.id });

    // Delete the badge itself
    await badge.deleteOne();

    res.status(200).json({
      message: "Badge and badge records successfully deleted!",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};
