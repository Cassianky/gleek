import express from "express";
import {
  getAllSubmittedSurveys,
  getSurveyWithSurveyId,
  submitSurvey,
  updateSurvey
} from "../../controller/surveyController.js";

const router = express.Router();

/*
 * GET /gleek/survey/surveyId
 * Get survey with known survey id
 */
router.get("/submitted", getAllSubmittedSurveys);

/*
 * GET /gleek/survey/surveyId
 * Get survey with known survey id
 */
router.get("/:surveyId", getSurveyWithSurveyId);


export default router;
