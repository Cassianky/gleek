import SurveyResponse from "../model/AdminSurveyResponseModel.js";
import Booking from "../model/bookingModel.js";
import Review from "../model/reviewModel.js";

/*
 * Get the survey for a booking, or return nothing if no survey exists.
 */
export const getSurveyForBooking = async (req, res) => {
  try {
    const client = req.user;

    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("client", client._id )
    console.log("booking",booking.clientId)

    if (!client._id.equals(booking.clientId)) {
      return res.status(403).json({ message: "Unauthorised." });
    }

    const survey = await SurveyResponse.findOne({ booking: bookingId });
    const review = await Review.findOne({ booking: bookingId });

    if (!survey) {
      // return empty survey object
      return res.status(200).send({});
    }

    return res.status(200).json({ survey, review });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const updateSurveyDraftForBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

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
      status: "DRAFT",
    };

    const survey = await SurveyResponse.findOneAndUpdate(
      { booking: bookingId },
      updateFields,
      { new: true },
    );

    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitSurveyForBooking = async (req, res) => {
  try {
    const client = req.user;

    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);

    const { rating, comment } = req.body.review;

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
    } = req.body.survey;

    const updateFields = {
      booking: bookingId,
      activity: booking.activityId,
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

    const reviewUpdateFields = {
      rating,
      comment,
      booking: bookingId,
      activity: booking.activityId,
      client: client._id,
    };

    let survey = await SurveyResponse.findOneAndUpdate(
      // in case we want draft surveys
      { booking: bookingId },
      updateFields,
      { new: true, upsert: true },
    );

    let review = await Review.findOneAndUpdate(
      { booking: bookingId },
      reviewUpdateFields,
      { new: true, upsert: true },
    );

    await Booking.findByIdAndUpdate(
      bookingId,
      { isSurveySubmitted: true },
      { new: true },
    );

    return res.status(200).json({ survey, review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// /*
//  * Get the survey for a booking.
//  * If no survey exists for the booking that has already finished, then create one.
//  */

// export const getOrCreateSurveyForBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.bookingId;

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const survey = await SurveyResponse.findOne({ booking: bookingId });

//     // Create if no survey found and survey is needed
//     if (
//       !survey &&
//       (booking.status === "PENDING_PAYMENT" || booking.status === "PAID")
//     ) {
//       const newSurvey = new SurveyResponse({
//         booking: bookingId,
//         activity: booking.activityId,
//       });

//       await newSurvey.save();

//       booking.adminSurveyResponse = newSurvey._id;
//       await booking.save();

//       return res.status(200).json(newSurvey);
//     }

//     return res.status(200).json(survey);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ message: "Server error" });
//   }
// };

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
    } = req.body.survey;

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

export const getSurveyWithSurveyId = async (req, res) => {
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
