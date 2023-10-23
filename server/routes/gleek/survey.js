import express from "express";
import {
  getSurveyForBooking,
  getSurveyWithSurveyId,
  getSurveysForClient,
  submitSurvey,
  submitSurveyForBooking,
  updateSurvey,
} from "../../controller/surveyController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

/*
 * GET /gleek/survey/booking/bookingId
 * Get survey by booking id
 */
router.get("/booking/:bookingId", verifyToken, getSurveyForBooking);
router.get("/pending", verifyToken, getSurveysForClient);
/*
 * POST /gleek/survey/booking/bookingId/submit
 * Submit survey for booking with bookingId
 */
router.post("/booking/:bookingId/submit", verifyToken, submitSurveyForBooking);

// /*
//  * POST /gleek/survey/booking/bookingId/draft
//  * Submit survey for booking with bookingId
//  */
// router.post("/booking/:bookingId/draft", updateSurveyDraftForBooking);

/*
 * GET /gleek/survey/surveyId
 * Get survey with known survey id
 */
router.get("/:surveyId", getSurveyWithSurveyId);

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
