import express from "express";
import {
  getActivitiesByVendorId,
  getFeaturedActivitiesToShowToday,
  getVendorActivities,
} from "../../controller/activityController.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
const router = express.Router();

// /gleek/activity/vendor/vendorId
router.get("/vendor/:vendorId", getActivitiesByVendorId);

// /gleek/activity/feature
router.get("/feature", getFeaturedActivitiesToShowToday);

export default router;
