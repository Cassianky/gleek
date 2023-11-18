import BadgeRecordModel from "../model/badgeRecordModel.js";
import ClientModel from "../model/clientModel.js";
import { s3GetImages } from "../service/s3ImageServices.js";
import BookingModel from "../model/bookingModel.js";
import {
   NotificationAction,
   NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { Role } from "../util/roleEnum.js";
import { createNotification } from "./notificationController.js";

const sendBadgeNotification = async (badgeRecord, session) => {
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

export const getAllBadgeRecordsForClient = async (req, res) => {
   try {
      const client = req.user;
      const badgeRecords = await BadgeRecordModel.find({
         client: client._id,
      }).populate({
         path: "badge",
      });

      for (const badgeRecord of badgeRecords) {
         badgeRecord.badge.badgePreSignedImage = await s3GetImages(
            badgeRecord.badge.badgeImage
         );
      }

      res.status(200).json({
         badgeRecords: badgeRecords,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         status: "error",
         msg: "Server Error! Unable to get badge records by client ID.",
      });
   }
};

export const getClientProfile = async (req, res) => {
   try {
      console.log(req.params.id);
      const client = await ClientModel.findById(req.params.id).select(
         "-password"
      );

      if (client.photo) {
         const preSignedPhoto = await s3GetImages(client.photo);
         client.preSignedPhoto = preSignedPhoto;
      }

      const badgeRecords = await BadgeRecordModel.find({
         client: client._id,
      }).populate({
         path: "badge",
      });

      for (const badgeRecord of badgeRecords) {
         badgeRecord.badge.badgePreSignedImage = await s3GetImages(
            badgeRecord.badge.badgeImage
         );
      }

      return res.status(200).json({
         badgeRecords: badgeRecords,
         clientProfile: client,
      });
   } catch (e) {
      console.log(e);
      res.status(500).json("Server Error");
   }
};

// Update all badges endpoint
export const updateAllBadgeRecords = async (req, res) => {
   try {
      const clients = await ClientModel.find({ status: "APPROVED" });

      for (const client of clients) {
         let badgeRecords = await BadgeRecordModel.find({
            client: client._id,
         }).populate("badge");

         badgeRecords = badgeRecords.filter(
            (record) => record.isCompleted === false
         );
         if (badgeRecords.length > 0) {
            const clientId = client._id;
            const completedStatuses = ["PENDING_PAYMENT", "PAID"];

            const query = {
               status: {
                  $in: completedStatuses,
               },
               clientId: clientId,
            };

            // Get count of completed bookings of client
            const completedBookings =
               await BookingModel.find(query).populate("activityId");

            // Get all unique SDGs
            const sdgSet = new Set();

            completedBookings.forEach((booking) => {
               if (booking.activityId && booking.activityId.sdg) {
                  booking.activityId.sdg.forEach((sdg) => {
                     sdgSet.add(sdg);
                  });
               }
            });

            for (const badgeRecord of badgeRecords) {
               if (
                  badgeRecord.badge.sdgBadgeType === "GOLD" ||
                  badgeRecord.badge.sdgBadgeType === "SILVER"
               ) {
                  badgeRecord.sdgCount = sdgSet.size;
                  badgeRecord.updated = Date.now();

                  // Badge is updated as completed
                  // Add notifications and emails here
                  if (sdgSet.size >= badgeRecord.badge.sdgThreshold) {
                     badgeRecord.isCompleted = true;
                     await sendBadgeNotification(badgeRecord, session);
                     console.log(notificationReq);
                  }

                  badgeRecord.save();
               } else if (badgeRecord.badge.sdgBadgeType === "BRONZE") {
                  console.log(badgeRecord.badge.sdg);
                  badgeRecord.updated = Date.now();

                  // Badge is updated as completed
                  // Add notifications and emails here
                  if (sdgSet.has(badgeRecord.badge.sdg)) {
                     badgeRecord.isCompleted = true;
                     // console.log(badgeRecord);
                     await sendBadgeNotification(badgeRecord, session);
                  }

                  badgeRecord.save();
               } else if (badgeRecord.badge.sdgBadgeType === "OTHER") {
                  badgeRecord.bookingCount = completedBookings.length;
                  badgeRecord.updated = Date.now();

                  // Badge is updated as completed
                  // Add notifications and emails here
                  if (sdgSet.size >= badgeRecord.badge.sdgThreshold) {
                     badgeRecord.isCompleted = true;
                     // console.log(badgeRecord);
                     await sendBadgeNotification(badgeRecord, session);
                  }

                  badgeRecord.save();
               }
            }
         }
      }
      return res.status(200).json({
         message: "Client badge records are successfully updated!",
      });
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ status: "error", msg: "Server Error" });
   }
};
