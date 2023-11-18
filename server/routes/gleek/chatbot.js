import express from "express";
const router = express.Router();
import { verifyToken } from "../../middleware/clientAuth.js";
import {
  getTop5BookedActivities,
  get5MostRecentActivities,
} from "../../controller/chatBotController.js";

/*
Note: This file contains the /chatbot router
*/

router.get("/get5MostRecentActivities", get5MostRecentActivities);
router.get("/getTop5BookedActivities", getTop5BookedActivities);
export default router;
