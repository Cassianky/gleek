import express from "express";
import { getLeaderBoard } from "../../controller/leaderboardController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

// /gleek/activity/vendor/vendorId
router.get("/", getLeaderBoard);

export default router;
