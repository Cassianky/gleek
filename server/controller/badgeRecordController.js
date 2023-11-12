import BadgeRecordModel from "../model/badgeRecordModel.js";
import ClientModel from "../model/clientModel.js";
import { s3GetImages } from "../service/s3ImageServices.js";

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
