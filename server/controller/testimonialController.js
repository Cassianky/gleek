import Testimonial from "../model/testimonialModel.js";
import Survey from "../model/adminSurveyResponseModel.js";

/*
 * Get the testimonial based on survey
 */
export const getTestimonialForSurvey = async (req, res) => {
  try {
    const client = req.user;

    const surveyId = req.params.bookingId;
    const survey = await Survey.findById(bookingId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // if (!client._id.equals(survey.clientId)) {
    //   return res.status(403).json({ message: "Unauthorised." });
    // }

    const testimonial = await Testimonial.findOne({ survey: surveyId });

    return res.status(200).json({ testimonial: testimonial });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const client = req.user;

    const testimonialId = req.params.testimonialId;

    const testimonial = await Testimonial.findById(testimonialId);

    return res.status(200).json({ testimonial: testimonial });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate({
      path: "survey",
      // populate: {
      //   path: "linkedVendor",
      //   select: "companyName companyEmail",
      // },
    });

    return res.status(200).json(testimonials);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
