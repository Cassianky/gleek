import ActivityModel from "../model/activityModel.js";
import ReviewModel from "../model/reviewModel.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .populate({
        path: "client",
        select: "-password",
      })
      .populate({
        path: "activity",
      })
      .populate({
        path: "booking",
      });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to get reviews.",
      error: error.message,
    });
  }
};

export const getAllReviewsForVendor = async (req, res) => {
  try {
    const vendor = req.user;
    const reviews = await ReviewModel.find()
      .populate({
        path: "client",
        select: "-password",
      })
      .populate({
        path: "activity",
      })
      .populate({
        path: "booking",
      });

    const reviewsForVendor = reviews.filter((review) => {
      return review.activity.linkedVendor.toString() === vendor._id.toString();
    });

    res.status(200).json(reviewsForVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to get reviews.",
      error: error.message,
    });
  }
};

export const getAllReviewsForActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId;

    const activity = await ActivityModel.findById(activityId);
    const reviews = await ReviewModel.find({ activity: activityId })
      .populate({
        path: "client",
        select: "-password",
      })
      .populate({
        path: "activity",
      })
      .populate({
        path: "booking",
      });

    res.status(200).json({ activity: activity, reviews: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to get reviews.",
      error: error.message,
    });
  }
};

export const toggleReviewVisibility = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    console.log("toggleReviewVisibility", reviewId);
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }
    review.hidden = !review.hidden;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to toggle review visibility.",
      error: error.message,
    });
  }
};
