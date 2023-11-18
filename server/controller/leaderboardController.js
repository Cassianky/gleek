import BookingModel from "../model/bookingModel.js";

export const getLeaderBoard = async (req, res) => {
  try {
    let bookings = await BookingModel.find().populate([
      {
        path: "clientId",
        select: "-password",
      },
      {
        path: "activityId",
        populate: [{ path: "theme" }],
      },
    ]);
    const mappedClients = {};
    bookings = bookings.filter(
      (booking) =>
        !(booking.status === "REJECTED" || booking.status === "CANCELLED"),
    );
    bookings.forEach((booking) =>
      mappedClients[booking.clientId.id]
        ? mappedClients[booking.clientId.id].push(booking)
        : (mappedClients[booking.clientId.id] = [booking]),
    );

    res.status(200).json(mappedClients);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: err.message });
  }
};
