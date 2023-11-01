import express from "express";
import {
  getAllReviews,
  getAllReviewsForActivity,
  toggleReviewVisibility,
} from "../../controller/reviewController.js";

const router = express.Router();
router.get("/", getAllReviews);
router.get("/activity/:activityId", getAllReviewsForActivity);
router.get("/:reviewId/toggleVisibility", toggleReviewVisibility);

export default router;
