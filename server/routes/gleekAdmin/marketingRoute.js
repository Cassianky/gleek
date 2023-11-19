import express from "express";

import adminAuth from "../../middleware/adminAuth.js";
import {
  cancelScheduledNewsletter,
  getAllScheduledNewsletters,
  getPreview,
  saveScheduledNewsletter,
  testSendNewsletter,
  updateScheduledNewsletter,
} from "../../controller/newsletterController.js";
import { uploadS3NewsletterImage } from "../../middleware/multer.js";
import { getMailingLists } from "../../controller/mailingListController.js";
const router = express.Router();

// /marketing/xxx
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

// router.get("/getNewsletterPreview", adminAuth, getPreview);
router.get(
  "/getNewsletterPreview/:messageBody/:preSignedPhoto/:newsletterType",
  adminAuth,
  getPreview,
);

router.post("/testSendNewsletter", adminAuth, testSendNewsletter);

router.get("/getMailingLists", adminAuth, getMailingLists);

export default router;
