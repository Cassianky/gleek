import express from "express";
import {
  createBadge,
  updateBadge,
  getAllBadges,
  deleteBadgeAndBadgeRecords,
} from "../../controller/badgeController.js";
import {
  updateAllBadgeRecords,
  getAllBadgeRecords,
} from "../../controller/badgeRecordController.js";
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
  createBadge,
);
router.patch("/updateBadge/:id", adminAuth, updateBadge);
router.post("/updateAllBadgeRecords", adminAuth, updateAllBadgeRecords);
router.get("/getAllBadges", adminAuth, getAllBadges);
router.get("/getAllBadgeRecords/:id", adminAuth, getAllBadgeRecords);
router.patch(
  "/deleteBadgeAndBadgeRecords/:id",
  adminAuth,
  deleteBadgeAndBadgeRecords,
);
export default router;
