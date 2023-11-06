import BadgeModel from "../model/badgeModel";

export const badgeExists = async (name) => {
  const oldBadge = await BadgeModel.findOne({ name });
  return !!oldBadge;
};

// create badge endpoint
export const createBadge = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { ...newBadge } = req.body;

    if (await badgeExists()) {
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};
