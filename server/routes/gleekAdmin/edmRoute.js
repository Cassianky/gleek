import express from "express";

import adminAuth from "../../middleware/adminAuth.js";
import {
  cancelScheduledEmail,
  getAllScheduledEmails,
  saveScheduledEmail,
  sendCustomEdm,
} from "../../controller/edmController.js";
const router = express.Router();

// /edm/xxx
router.post("/sendCustomEdm", adminAuth, sendCustomEdm);
router.post("/saveScheduledEmail", adminAuth, saveScheduledEmail);
router.patch("/cancelScheduledEmail", adminAuth, cancelScheduledEmail);
router.get("/getAllScheduledEmails", adminAuth, getAllScheduledEmails);

export default router;
