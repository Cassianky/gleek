import express from "express";

const router = express.Router();
import adminAuth from "../../middleware/adminAuth.js";
import {
  getAllTestimonials,
  getTestimonialById,
} from "../../controller/testimonialController.js";

router.get("/", adminAuth, getAllTestimonials);
router.get("/:testimonialId", getTestimonialById);

export default router;
