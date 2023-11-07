import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  
  testimonialBody: { type: String, required: true },
  displayName: { type: String, required: true },
  hidden: { type: Boolean, required: true, default: true },
  created: { type: Date, required: true },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
