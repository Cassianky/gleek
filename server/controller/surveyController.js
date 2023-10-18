import SurveyResponse from "../model/AdminSurveyResponseModel.js";
import Booking from "../model/bookingModel.js";

/*
 * Get the survey for a booking.
 * If no survey exists for the booking that has already finished, then create one.
 */

export const getOrCreateSurveyForBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const survey = await SurveyResponse.findOne({ booking: bookingId });

    // Create if no survey found and survey is needed
    if (
      !survey &&
      (booking.status === "PENDING_PAYMENT" || booking.status === "PAID")
    ) {
      const newSurvey = new SurveyResponse({
        booking: bookingId,
        activity: booking.activityId,
      });

      await newSurvey.save();

      booking.adminSurveyResponse = newSurvey._id;
      await booking.save();

      return res.status(200).json(newSurvey);
    }

    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
export const getSurveysForClient = async (req, res) => {
  try {
    const client = req.user;
    const bookings = await Booking.find({
      clientId: client._id,
      status: { $in: ["PENDING_PAYMENT", "PAID"] },
    });

    const surveyResponses = [];

    for (const booking of bookings) {
      let survey = await SurveyResponse.findOne({ booking: booking._id })
        .populate("activity")
        .populate("booking");

      if (!survey) {
        const newSurvey = new SurveyResponse({
          booking: booking._id,
          activity: booking.activityId,
        });

        await newSurvey.save();

        booking.adminSurveyResponse = newSurvey._id;
        await booking.save();

        survey = await SurveyResponse.findById(newSurvey._id)
          .populate("activity")
          .populate("booking");

        surveyResponses.push(survey);
      } else {
        surveyResponses.push(survey);
      }
    }

    return res.status(200).json(surveyResponses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    const {
      feedbackRating,
      recommendationScore,
      potentialNextActivityDate,
      repeatActivityScore,
      repeatActivityDifferentVendorScore,
      differentActivityScore,
      generalFeedback,
      activityLiked,
      activityImprovements,
      testimonial,
      displayName,
      potentialReferrals,
    } = req.body;

    const updateFields = {
      feedbackRating,
      recommendationScore,
      potentialNextActivityDate,
      repeatActivityScore,
      repeatActivityDifferentVendorScore,
      differentActivityScore,
      generalFeedback,
      activityLiked,
      activityImprovements,
      testimonial,
      displayName,
      potentialReferrals,
    };
    const survey = await SurveyResponse.findByIdAndUpdate(
      surveyId,
      updateFields,
      { new: true },
    );

    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitSurvey = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;

    const {
      feedbackRating,
      recommendationScore,
      potentialNextActivityDate,
      repeatActivityScore,
      repeatActivityDifferentVendorScore,
      differentActivityScore,
      generalFeedback,
      activityLiked,
      activityImprovements,
      testimonial,
      displayName,
      potentialReferrals,
    } = req.body;

    const updateFields = {
      feedbackRating,
      recommendationScore,
      potentialNextActivityDate,
      repeatActivityScore,
      repeatActivityDifferentVendorScore,
      differentActivityScore,
      generalFeedback,
      activityLiked,
      activityImprovements,
      testimonial,
      displayName,
      potentialReferrals,
      status: "SUBMITTED",
    };

    const survey = await SurveyResponse.findByIdAndUpdate(
      surveyId,
      updateFields,
      { new: true },
    );

    await Booking.findByIdAndUpdate(
      survey.booking,
      { isSurveySubmitted: true },
      { new: true },
    );

    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSurvey = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const survey = await SurveyResponse.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
