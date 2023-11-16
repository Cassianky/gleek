import express from "express";

const router = express.Router();

import { getAllVisibleTestimonials } from "../../controller/testimonialController.js";

router.get("/", getAllVisibleTestimonials);

export default router;
