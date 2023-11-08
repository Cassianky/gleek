import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import "../loadEnvironment.js";
import { analyzeFeedback, getSentiment } from "../service/nlpService.js";
import { getActivitySentiment } from "../controller/dashboardController.js";

chai.use(chaiHttp);
const expect = chai.expect;

const uri =
  "mongodb+srv://admin:passwordAceyyy@cluster0.qin7gar.mongodb.net/?retryWrites=true&w=majority";

describe("NLP", () => {
  before(async () => {
    await mongoose.connect(uri, {});
    mongoose.connection;
  });

  it("should return positive analysis", async () => {
    const feedback = "The event was very good!";
    try {
      const result = getSentiment(feedback);
      console.log(result);
      expect(result.overallSentiment).to.equal(1);
    } catch (error) {
      console.error(error);
    }
  });

  it("should return negative analysis", async () => {
    const feedback = "The event was not good!";
    try {
      const result = getSentiment(feedback);
      console.log(result);
      expect(result.overallSentiment).to.equal(-1);
    } catch (error) {
      console.error(error);
    }
  });

  it("should return analysis", async () => {
    const activityLiked =
      "I think the activity was fun and engaging. I greatly enjoyed it and had a wonderful time. Very nice";
    const activityImprovements =
      "It was too tiring, some parts were not exciting.";
    try {
      const { activityLikedKeyWords, activityImprovementsKeyWords } =
        analyzeFeedback(activityLiked, activityImprovements);
      console.log(activityLikedKeyWords, activityImprovementsKeyWords);
      expect(result.overallSentiment).to.equal(-1);
    } catch (error) {
      console.error(error);
    }
  });

  it("should remove stopwords in review", async () => {
    const review =
      "I think the activity was fun and engaging. I greatly enjoyed it and had a wonderful time. Very nice. However, I felt like some parts were tiring";
    try {
      const { overallSentiment, keyWords } = getSentiment(review);
      console.log(keyWords);
      expect(overallSentiment).to.equal(-1);
    } catch (error) {
      console.error(error);
    }
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
