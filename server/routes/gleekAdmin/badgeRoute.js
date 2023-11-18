import express from "express";
import { createBadge, updateBadge } from "../../controller/badgeController.js";
import { updateAllBadgeRecords } from "../../controller/badgeRecordController.js";
import { uploadS3BadgeImage } from "../../middleware/multer.js";
import adminAuth from "../../middleware/adminAuth.js";
const router = express.Router();

/*
 * GET /gleek/createBadge
 */
router.post(
  "/createBadge",
  adminAuth,
  uploadS3BadgeImage.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createBadge
);
router.patch("/updateBadge/:id", adminAuth, updateBadge);
router.post("/updateAllBadgeRecords", adminAuth, updateAllBadgeRecords);
export default router;
