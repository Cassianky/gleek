import express from "express";

import adminAuth from "../../middleware/adminAuth.js";
import {
  cancelScheduledNewsletter,
  getAllScheduledNewsletters,
  saveScheduledNewsletter,
  sendCustomEdm,
  updateScheduledNewsletter,
} from "../../controller/newsletterController.js";
const router = express.Router();

// /marketing/xxx
router.post("/sendCustomEdm", adminAuth, sendCustomEdm);
router.post("/saveScheduledNewsletter", adminAuth, saveScheduledNewsletter);
router.patch(
  "/updateScheduledNewsletter/:scheduledNewsletterId",
  adminAuth,
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
