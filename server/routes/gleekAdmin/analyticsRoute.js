import express from "express";
import {
    calculateAdminProfit,
    calculateAdminSurveyReviewSentiment
} from "../../controller/dashboardController.js";
import {
    getAllReviews
} from "../../controller/reviewController.js";

const router = express.Router();
router.get("/bookingReviews", getAllReviews);
router.get("/activityDetails", calculateAdminProfit);
router.get("/sentiments", calculateAdminSurveyReviewSentiment);
export default router;
