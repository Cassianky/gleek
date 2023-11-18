import ActivityModel from "../model/activityModel.js";
import BookingModel from "../model/bookingModel.js";
import { s3GetImages } from "../service/s3ImageServices.js";

export const getTop5BookedActivities = async (req, res) => {
  try {
    const topActivities = await BookingModel.aggregate([
      {
        $group: {
          _id: "$activityId",
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalBookings: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "activities",
          localField: "_id",
          foreignField: "_id",
          as: "activityDetails",
        },
      },
      {
        $unwind: "$activityDetails",
      },
      {
        $project: {
          _id: 0,
          activityId: "$_id",
          totalBookings: 1,
          activityDetails: 1,
        },
      },
    ]);

    // Populate the minimum price per pax for each activity
    for (const activity of topActivities) {
      activity.activityDetails.preSignedImages = await s3GetImages(
        activity.activityDetails.images,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Top 5 booked activities fetched!",
      topActivities: topActivities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, msg: "Server error" });
  }
};

export const get5MostRecentActivities = async (req, res) => {
  try {
    const recentActivities = await ActivityModel.aggregate([
      {
        $sort: {
          creationDateTime: 1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    // Populate the minimum price per pax for each activity
    for (const activity of recentActivities) {
      activity.preSignedImages = await s3GetImages(activity.images);
    }

    console.log(recentActivities);

    return res.status(200).json({
      success: true,
      message: "Top 5 booked activities fetched!",
      recentActivities: recentActivities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, msg: "Server error" });
  }
};
