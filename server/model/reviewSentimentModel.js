import mongoose from "mongoose";

const reviewSentimentSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Review",
  },
  overallSentiment: {
    type: Number,
  },
  keywords: [
    {
      word: {
        type: String,
      },
      sentiment: { type: String, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
    },
  ],
});

const ReviewSentimentModel = mongoose.model(
  "ReviewSentiment",
  reviewSentimentSchema
);

export default ReviewSentimentModel;
