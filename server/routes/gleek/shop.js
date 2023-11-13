import express from "express";
import {
  getActivitiesWithFilters,
  getActivity,
  getAllActiveThemes,
  getAllActivitiesNames,
  getMinAndMaxPricePerPax,
  getQuotationPdf,
  getQuotationPdfUrl,
} from "../../controller/activityController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

/*
Note: This file contains the /shop router
*/

router.get("/getAllThemes", verifyToken, getAllActiveThemes);

router.post("/getFilteredActivities", verifyToken, getActivitiesWithFilters);

router.get("/getAllActivitiesNames", verifyToken, getAllActivitiesNames);

router.get("/getMinAndMaxPricePerPax", verifyToken, getMinAndMaxPricePerPax);

router.get("/viewActivity/:id", verifyToken, getActivity);

router.post("/getQuotationPdfUrl", verifyToken, getQuotationPdfUrl);

router.get("/getQuotationPdf/:path", verifyToken, getQuotationPdf);
export default router;
