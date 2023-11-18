import mongoose from "mongoose";

const consentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  receiveAdminNewsletters: {
    type: Boolean,
    required: true,
    default: true,
  },
  receivePersonalisedRecommendations: {
    type: Boolean,
    required: true,
    default: true,
  },
  acceptTermsAndConditions: {
    type: Boolean,
    required: true,
    default: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const ConsentModel = mongoose.model("Consent", consentSchema);

export default ConsentModel;
