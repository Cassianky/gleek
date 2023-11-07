import express from "express";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
import { getTotalRevenue } from "../../controller/dashboardController.js";

const router = express.Router();

router.get("/view", vendorVerifyToken, getTotalRevenue);

export default router;
