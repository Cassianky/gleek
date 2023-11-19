import express from "express";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
import { getTotalRevenue } from "../../controller/dashboardController.js";
import { getAllReviewsForVendor } from "../../controller/reviewController.js";

const router = express.Router();

router.get("/view", vendorVerifyToken, getTotalRevenue);
router.get("/bookingReviews", vendorVerifyToken, getAllReviewsForVendor);
export default router;
