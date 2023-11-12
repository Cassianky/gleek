import sendMail from "../util/sendMail.js";
import { createCustomEdmMailOptions } from "../util/sendMailOptions.js";
import ScheduledNewsletterModel from "../model/scheduledNewsletterModel.js";
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

export const saveScheduledNewsletter = async (req, res) => {
  try {
    const { subject, messageBody, scheduledTime, photo } = req.body;
    const newScheduledNewsletter = new ScheduledNewsletterModel({
      subject,
      messageBody,
      photo,
      scheduledTime,
    });
    await newScheduledNewsletter.save();
    return res.status(200).json({ message: "Scheduled email saved!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to save scheduled email.",
      error: err.message,
    });
  }
};

export const cancelScheduledNewsletter = async (req, res) => {
  try {
    const { scheduledNewsletterId } = req.body;
    await ScheduledNewsletterModel.findByIdAndDelete(scheduledNewsletterId);
    res.status(200).json({ message: "Scheduled email cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to cancel scheduled email.",
      error: err.message,
    });
  }
};

export const getAllScheduledNewsletters = async (req, res) => {
  try {
    const scheduledNewsletters = await ScheduledNewsletterModel.find();
    res.status(200).json(scheduledNewsletters);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to get all scheduled emails.",
      error: err.message,
    });
  }
};

// Run scheduler every minute
cron.schedule("* * * * *", async () => {
  try {
    const currentTimestamp = Date.now();
    console.log(
      `Cron job running at: ${new Date(currentTimestamp).toLocaleString()}`
    );

    // Find scheduled emails that are due to be sent
    const scheduledNewslettersDue = await ScheduledNewsletterModel.find({
      scheduledTime: { $lte: currentTimestamp },
      status: "SCHEDULED",
    });

    // Send the due emails
    scheduledNewslettersDue.forEach(async (scheduledNewsletter) => {
      try {
        console.log("Sending due email...");
        sendMail(
          createCustomEdmMailOptions(
            {
              name: "Yiying",
              email: "yowyiying@gmail.com",
            },
            scheduledNewsletter.subject,
            scheduledNewsletter.messageBody
          )
        );
        await ScheduledNewsletterModel.findByIdAndUpdate(
          scheduledNewsletter._id,
          {
            status: "SENT",
          }
        );
      } catch (error) {
        console.error(`Error sending scheduled email: ${error.message}`);
        await ScheduledNewsletterModel.findByIdAndUpdate(
          scheduledNewsletter._id,
          {
            status: "FAILED",
            errorLog: error.message,
          }
        );
      }
    });
  } catch (error) {
    console.error(`Cron job error: ${error.message}`);
  }
});
