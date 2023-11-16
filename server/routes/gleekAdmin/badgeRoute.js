import express from "express";
import { createBadge, updateBadge } from "../../controller/badgeController.js";
import { uploadS3BadgeImage } from "../../middleware/multer.js";
const router = express.Router();

/*
 * GET /gleek/createBadge
 */
router.post(
  "/createBadge",
  uploadS3BadgeImage.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createBadge,
);
router.patch("/updateBadge/:id", updateBadge);
export default router;
