import express from "express";

const router = express.Router();
import adminAuth from "../../middleware/adminAuth.js";
import {
  createTestimonialFromSurvey,
  deleteTestimonialById,
  getAllTestimonials,
  getTestimonialById,
  getTestimonialForSurvey,
  toggleTestimonialVisibility,
  updateTestimonialById,
} from "../../controller/testimonialController.js";

router.get("/", adminAuth, getAllTestimonials);

router.get("/:testimonialId", getTestimonialById);
router.patch("/:testimonialId", updateTestimonialById);
router.delete("/:testimonialId", deleteTestimonialById);

router.post("/:testimonialId/toggleVisibility", toggleTestimonialVisibility);

router.get("/survey/:surveyId", getTestimonialForSurvey);

router.post("/create", adminAuth, createTestimonialFromSurvey);

export default router;
