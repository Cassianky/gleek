import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  testimonialBody: { type: String, required: true },
  displayName: { type: String, required: true },
  isShown: { type: Boolean, required: true, default: false },
  created: { type: Date, required: true },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
