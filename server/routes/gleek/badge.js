import express from "express";
import {
  getAllBadgeRecordsForClient,
  getClientProfile,
} from "../../controller/badgeRecordController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

// Badge
// /gleek/badge/getAllBadgeRecordsForClient
router.get(
  "/getAllBadgeRecordsForClient",
  verifyToken,
  getAllBadgeRecordsForClient
);
router.get("/getClientProfile/:id", getClientProfile);
export default router;
