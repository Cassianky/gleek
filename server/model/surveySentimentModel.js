import mongoose from "mongoose";

const surveySentimentSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  adminSurveyResponse: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "AdminSurveyResponse",
  },
  overallSentiment: {
    type: Number,
  },
  activityImprovementsKeyWords: [
    {
      word: {
        type: String,
      },
      sentiment: { type: String, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
    },
  ],
  activityLikedKeyWords: [
    {
      word: {
        type: String,
      },
      sentiment: { type: String, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
    },
  ],
});

const SurveySentimentModel = mongoose.model(
  "SurveySentiment",
  surveySentimentSchema,
);

export default SurveySentimentModel;
