import Client from "../model/clientModel.js";
import sendMail from "../util/sendMail.js";
import { createRegistrationApprovalEmailOptions } from "../util/sendMailOptions.js";
import cron from "node-cron";

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

export const updateClient = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id },
      { ...updateData, approvedDate: Date.now() },
      { new: true },
    );
    sendMail(createRegistrationApprovalEmailOptions(updatedClient));
    return res.status(201).json(updatedClient);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

export const getClientDetails = async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.status(200).json(client);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

export const deleteAllRejectedClientAfterThirtyDays = async (req, res) => {
  try {
    // Calculate the date 30 days ago
    const dateThirtyDaysAgo = new Date();
    dateThirtyDaysAgo.setDate(dateThirtyDaysAgo.getDate() - 30);

    console.log(dateThirtyDaysAgo);

    const rejectedClientsToBeDelete = await Client.find({
      status: "REJECTED",
      approvedDate: { $lte: dateThirtyDaysAgo },
    });

    console.log(rejectedClientsToBeDelete);

    for (const client of rejectedClientsToBeDelete) {
      await Client.findByIdAndDelete(client._id);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error, unable to delete clients rejected 30 days ago.",
      error: error.message,
    });
  }
};

cron.schedule("0 0 0 * * *", async () => {
  try {
    await deleteAllRejectedClientAfterThirtyDays();
    console.log(
      "Scheduled daily task to delete rejected client(s) from 30 days ago",
    );
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});
