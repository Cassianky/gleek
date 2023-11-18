import ConsentModel from "../model/consentModel.js";

export const getMailingLists = async (req, res) => {
  try {
    const mailingLists = await ConsentModel.find({
      client: { $ne: null },
    }).populate({
      path: "client",
      select: "name email companyName", // Specify the fields you want to include
    });

    return res.status(200).json(mailingLists);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to retrieve mailing lists.",
      error: err.message,
    });
  }
};
