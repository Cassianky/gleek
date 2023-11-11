import sendMail from "../util/sendMail.js";
import { createCustomEdmMailOptions } from "../util/sendMailOptions.js";
import ScheduledEmailModel from "../model/scheduledEmailModel.js";
import cron from "node-cron";

export const sendCustomEdm = async (req, res) => {
  try {
    // const { subject, html, attachments, to } = req.body;
    // const mailOptions = {
    // from: "Gleek <" + process.env.EMAIL_USER + ">",
    // to,
    // subject,
    // html,
    // attachments,
    // };
    // const info = await transporter.sendMail(mailOptions);
    // res.status(200).json({ message: "Email sent", info });
    // Get mailing list (array of client) from database, then send mail to each email

    sendMail(
      createCustomEdmMailOptions(
        {
          name: "Yiying",
          email: "yowyiying@gmail.com",
        },
        "Custome EDM Subject",
        "Custome EDM COntente lorem ipsum test test lkdfjvlerjlksdnflkjdfla ;sadf"
      )
    );
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.log(err);
  }
};

export const saveScheduledEmail = async (req, res) => {
  try {
    const { subject, messageBody, scheduledTime, photo } = req.body;
    const newScheduledEmail = new ScheduledEmailModel({
      subject,
      messageBody,
      photo,
      scheduledTime,
    });
    await newScheduledEmail.save();
    return res.status(200).json({ message: "Scheduled email saved!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to save scheduled email.",
      error: err.message,
    });
  }
};

export const cancelScheduledEmail = async (req, res) => {
  try {
    const { scheduledEmailId } = req.body;
    const scheduledEmail = await ScheduledEmailModel.findById(scheduledEmailId);
    scheduledEmail.status = "CANCELLED";
    await scheduledEmail.save();
    res.status(200).json({ message: "Scheduled email cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to cancel scheduled email.",
      error: err.message,
    });
  }
};

export const getAllScheduledEmails = async (req, res) => {
  try {
    const scheduledEmails = await ScheduledEmailModel.find();
    res.status(200).json(scheduledEmails);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to get all scheduled emails.",
      error: err.message,
    });
  }
};

cron.schedule("* * * * *", async () => {
  try {
    const currentTimestamp = Date.now();
    console.log(
      `Cron job running at: ${new Date(currentTimestamp).toLocaleString()}`
    );

    // Find scheduled emails that are due to be sent
    const scheduledEmailsDue = await ScheduledEmailModel.find({
      scheduledTime: { $lte: currentTimestamp },
      status: "SCHEDULED",
    });

    // Send the due emails
    scheduledEmailsDue.forEach(async (scheduledEmail) => {
      try {
        console.log("Sending due email...");
        sendMail(
          createCustomEdmMailOptions(
            {
              name: "Yiying",
              email: "yowyiying@gmail.com",
            },
            scheduledEmail.subject,
            scheduledEmail.messageBody
          )
        );
        await ScheduledEmailModel.findByIdAndUpdate(scheduledEmail._id, {
          status: "SENT",
        });
      } catch (error) {
        console.error(`Error sending scheduled email: ${error.message}`);
        await ScheduledEmailModel.findByIdAndUpdate(scheduledEmail._id, {
          status: "FAILED",
        });
      }
    });
  } catch (error) {
    console.error(`Cron job error: ${error.message}`);
  }
});
