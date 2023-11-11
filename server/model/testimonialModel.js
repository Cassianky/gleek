import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminSurveyResponse",
    required: true,
  },

  testimonialBody: { type: String, required: true },
  displayName: { type: String, required: true },
  clientName: { type: String, required: true },
  hidden: { type: Boolean, required: true, default: true },
  created: { type: Date, required: true },
  updated: { type: Date, required: true, default: Date.now },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
