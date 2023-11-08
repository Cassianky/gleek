import express from "express";

const router = express.Router();
import adminAuth from "../../middleware/adminAuth.js";
import {
  createTestimonialFromSurvey,
  getAllTestimonials,
  getTestimonialById,
  getTestimonialForSurvey,
  toggleTestimonialVisibility,
  updateTestimonialById,
} from "../../controller/testimonialController.js";

router.get("/", adminAuth, getAllTestimonials);
router.get("/:testimonialId", getTestimonialById);
router.get("/survey/:surveyId", getTestimonialForSurvey);
router.patch("/survey/:surveyId", updateTestimonialById);
router.post("/:testimonialId/toggleVisibility", toggleTestimonialVisibility);

router.post("/create", adminAuth, createTestimonialFromSurvey);

export default router;
