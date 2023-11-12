import express from "express";
import { createBadge, updateBadge } from "../../controller/badgeController.js";
import adminAuth from "../../middleware/adminAuth.js";
import { uploadS3BadgeImage } from "../../middleware/multer.js";
const router = express.Router();

/*
 * GET /gleek/createBadge
 */
router.post("/createBadge", uploadS3BadgeImage.single("image"), createBadge);
router.patch("/updateBadge/:id", updateBadge);
export default router;
