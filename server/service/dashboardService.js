import SurveySentimentModel from "../model/surveySentimentModel.js";

export const getAllSurveySentimentsForVendor = async (vendorId) => {
  return await SurveySentimentModel.find({
    vendorId: vendorId,
  });
};
