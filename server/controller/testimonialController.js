import Testimonial from "../model/testimonialModel.js";
import Survey from "../model/adminSurveyResponseModel.js";

/*
 * Get the testimonial based on survey
 */
export const getTestimonialForSurvey = async (req, res) => {
  try {
    const client = req.user;

    const surveyId = req.params.surveyId;
    const survey = await Survey.findById(surveyId);

    // if (!client._id.equals(survey.clientId)) {
    //   return res.status(403).json({ message: "Unauthorised." });
    // }

    const testimonial = await Testimonial.findOne({ survey: surveyId });

    return res
      .status(200)
      .json({ testimonial: testimonial, hasTestimonial: !!testimonial });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const client = req.user;

    const testimonialId = req.params.testimonialId;

    const testimonial =
      await Testimonial.findById(testimonialId).populate("survey");

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

export const getAllVisibleTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ hidden: false });

    return res.status(200).json(testimonials);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const toggleTestimonialVisibility = async (req, res) => {
  try {
    const testimonialId = req.params.testimonialId;
    console.log("toggleTestimonialVisibility", testimonialId);
    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }
    testimonial.hidden = !testimonial.hidden;
    await testimonial.save();

    res.status(200).json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to toggle testimonial visibility.",
      error: error.message,
    });
  }
};

export const createTestimonialFromSurvey = async (req, res) => {
  try {
    const { surveyId, testimonial, displayName } = req.body;
    const foundTestimonial = await Testimonial.findOne({
      survey: surveyId,
    });

    if (foundTestimonial) {
      return res.status(409).json({ message: "Testimonial already exists." });
    }

    const survey = await Survey.findById(surveyId).populate({
      path: "booking",
      populate: {
        path: "clientId",
        select: "name",
      },
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found." });
    }

    console.log(survey.booking.clientId);

    const newTestimonial = new Testimonial({
      survey: surveyId,
      testimonialBody: testimonial || survey.testimonial,
      displayName: displayName || survey.displayName,
      clientName: survey.booking.clientId.name,
      hidden: true,
      created: new Date(),
    });

    await newTestimonial.save();

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to create testimonial.",
      error: error.message,
    });
  }
};

export const updateTestimonialById = async (req, res) => {
  try {
    const testimonialId = req.params.testimonialId;
    const { testimonialBody, displayName, clientName, hidden } = req.body;
    const foundTestimonial =
      await Testimonial.findById(testimonialId).populate("survey");

    if (!foundTestimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    if (testimonialBody) {
      foundTestimonial.testimonialBody = testimonialBody;
    }

    if (displayName) {
      foundTestimonial.displayName = displayName;
    }

    if (clientName) {
      foundTestimonial.clientName = clientName;
    }

    if (hidden !== undefined) {
      foundTestimonial.hidden = hidden;
    }

    foundTestimonial.updated = new Date();

    await foundTestimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial: foundTestimonial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to update testimonial.",
      error: error.message,
    });
  }
};

export const deleteTestimonialById = async (req, res) => {
  try {
    const testimonialId = req.params.testimonialId;
    const deletedTestimonial =
      await Testimonial.findByIdAndDelete(testimonialId);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error! Unable to delete testimonial.",
      error: error.message,
    });
  }
};
