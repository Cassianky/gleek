import express from "express";

import adminAuth from "../../middleware/adminAuth.js";
import {
  cancelScheduledNewsletter,
  getAllScheduledNewsletters,
  saveScheduledNewsletter,
  sendCustomEdm,
  updateScheduledNewsletter,
} from "../../controller/newsletterController.js";
import { uploadS3NewsletterImage } from "../../middleware/multer.js";
const router = express.Router();

// /marketing/xxx
router.post("/sendCustomEdm", adminAuth, sendCustomEdm);
router.post(
  "/saveScheduledNewsletter",
  adminAuth,
  uploadS3NewsletterImage.single("image"),
  saveScheduledNewsletter,
);
router.patch(
  "/updateScheduledNewsletter/:scheduledNewsletterId",
  adminAuth,
  uploadS3NewsletterImage.single("image"),
  updateScheduledNewsletter,
);
router.delete(
  "/cancelScheduledNewsletter/:scheduledNewsletterId",
  adminAuth,
  cancelScheduledNewsletter,
);
router.get(
  "/getAllScheduledNewsletters",
  adminAuth,
  getAllScheduledNewsletters,
);

export default router;
