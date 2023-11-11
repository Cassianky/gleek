import express from "express";

import {
  bulkDeleteActivityDraft,
  deleteActivityDraft,
  getActivity,
  getActivityTitle,
  getAllActiveThemes,
  getPreSignedImgs,
  getVendorActivities,
  publishActivity,
  saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

/**
 * GET /gleekVendor/activity/mine
 * Get Activities belonging to the Vendor that made the request
 */
router.get("/mine", vendorVerifyToken, getVendorActivities);
router.delete("/deleteDraft/:id", vendorVerifyToken, deleteActivityDraft);
router.delete("/bulkDelete", vendorVerifyToken, bulkDeleteActivityDraft);
router.get("/getThemes", vendorVerifyToken, getAllActiveThemes);
router.post(
  "/saveActivity",
  vendorVerifyToken,
  uploadS3ActivityImages.array("images", 5),
  saveActivity
);
router.get("/viewActivity/:id", vendorVerifyToken, getActivity);
router.patch("/publishActivity/:id", vendorVerifyToken, publishActivity);
router.get("/getImages/:id", vendorVerifyToken, getPreSignedImgs);

router.get("/:activityId/title", vendorVerifyToken, getActivityTitle);

export default router;
