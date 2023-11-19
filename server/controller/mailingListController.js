import ConsentModel from "../model/consentModel.js";

export const getMailingLists = async (req, res) => {
  try {
    const mailingLists = await ConsentModel.find({
      client: { $ne: null },
    })
      .populate({
        path: "client",
        match: { status: "APPROVED" }, // Add this line to filter by client status
        select: "name email companyName status", // Specify the fields you want to include
      })
      .exec();

    // Filter out null clients after populating
    const filteredMailingLists = mailingLists.filter((item) => item.client);

    return res.status(200).json(filteredMailingLists);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to retrieve mailing lists.",
      error: err.message,
    });
  }
};
