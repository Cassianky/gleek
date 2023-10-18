import express from "express";
import {
  getOrCreateSurveyForBooking,
  getSurvey,
  getSurveysForClient,
  submitSurvey,
  updateSurvey,
} from "../../controller/surveyController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

/*
 * GET /gleek/survey/booking/bookingId
 * Get survey by booking id
 */
router.get("/booking/:bookingId", getOrCreateSurveyForBooking);
router.get("", verifyToken, getSurveysForClient);

/*
 * GET /gleek/survey/surveyId
 * Get survey with known survey id
 */
router.get("/:surveyId", getSurvey);

/*
 * POST /gleek/survey/surveyId
 * Update survey with survey id
 */
router.post("/:surveyId", updateSurvey);
/*
 * POST /gleek/survey/surveyId
 * Submit survey with survey id
 */
router.post("/:surveyId/submit", submitSurvey);

export default router;
