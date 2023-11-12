import express from "express";

import adminAuth from "../../middleware/adminAuth.js";
import {
  cancelScheduledNewsletter,
  getAllScheduledNewsletters,
  saveScheduledNewsletter,
  sendCustomEdm,
} from "../../controller/newsletterController.js";
const router = express.Router();

// /marketing/xxx
router.post("/sendCustomEdm", adminAuth, sendCustomEdm);
router.post("/saveScheduledNewsletter", adminAuth, saveScheduledNewsletter);
router.patch(
  "/cancelScheduledNewsletter",
  adminAuth,
  cancelScheduledNewsletter
);
router.get(
  "/getAllScheduledNewsletters",
  adminAuth,
  getAllScheduledNewsletters
);

export default router;
