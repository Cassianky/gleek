import sendMail from "../util/sendMail.js";
import { createCustomEdmMailOptions } from "../util/sendMailOptions.js";
import { s3GetImages } from "../service/s3ImageServices.js";
import ScheduledNewsletterModel from "../model/scheduledNewsletterModel.js";
import cron from "node-cron";
import { NewsletterTemplate } from "../assets/templates/NewsletterTemplate.js";
import { sendNewsletter } from "../service/newsletterService.js";

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
        "Custome EDM COntente lorem ipsum test test lkdfjvlerjlksdnflkjdfla ;sadf",
      ),
    );
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.log(err);
  }
};

export const saveScheduledNewsletter = async (req, res) => {
  try {
    const reqFile = req.file;
    let fileS3Location;
    if (reqFile === undefined) {
      console.log("No image files uploaded");
    } else {
      console.log("Retrieving uploaded images url");
      fileS3Location = req.file.location;
    }
    console.log(fileS3Location);

    const newsletterData = {
      ...req.body,
      ...(fileS3Location && { photo: fileS3Location }),
    };

    const newScheduledNewsletter = new ScheduledNewsletterModel(newsletterData);
    await newScheduledNewsletter.save();
    return res.status(200).json({ message: "Scheduled newsletter saved!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to save scheduled newsletter.",
      error: err.message,
    });
  }
};

export const updateScheduledNewsletter = async (req, res) => {
  try {
    const reqFile = req.file;
    let fileS3Location;
    if (reqFile === undefined) {
      console.log("No image files uploaded");
    } else {
      console.log("Retrieving uploaded images url");
      fileS3Location = req.file.location;
    }

    const { removeExistingPhoto, ...otherFields } = req.body;
    console.log("Remove photo?", removeExistingPhoto);

    const newsletterData = {
      ...otherFields,
      ...(fileS3Location && { photo: fileS3Location }),
      ...(removeExistingPhoto === "true" && { $unset: { photo: 1 } }),
    };

    console.log(newsletterData);

    const { scheduledNewsletterId } = req.params;
    await ScheduledNewsletterModel.findByIdAndUpdate(
      scheduledNewsletterId,
      newsletterData,
      { new: true, runValidators: true },
    );
    return res.status(200).json({ message: "Scheduled newsletter updated!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error! Unable to update scheduled newsletter.",
      error: err.message,
    });
  }
};

export const cancelScheduledNewsletter = async (req, res) => {
  try {
    const { scheduledNewsletterId } = req.params;
    await ScheduledNewsletterModel.findByIdAndDelete(scheduledNewsletterId);
    res
      .status(200)
      .json({ message: "Scheduled newsletter cancelled successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to cancel scheduled newsletter.",
      error: err.message,
    });
  }
};

export const getAllScheduledNewsletters = async (req, res) => {
  try {
    const scheduledNewsletters = await ScheduledNewsletterModel.find();

    for (let i = 0; i < scheduledNewsletters.length; i++) {
      if (scheduledNewsletters[i].photo) {
        scheduledNewsletters[i] = scheduledNewsletters[i].toObject();
        const preSignedUrl = await s3GetImages(scheduledNewsletters[i].photo);
        scheduledNewsletters[i].preSignedPhoto = preSignedUrl;
      }
    }

    res.status(200).json(scheduledNewsletters);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to get all scheduled newsletters.",
      error: err.message,
    });
  }
};

export const getPreview = async (req, res) => {
  try {
    const { messageBody, preSignedPhoto, newsletterType } = req.params;
    console.log(messageBody, preSignedPhoto, newsletterType);
    const admin = req.user;
    const htmlContent = NewsletterTemplate({
      recipientName: admin.name,
      messageBody: messageBody,
      preSignedPhoto: preSignedPhoto,
      forEmail: false,
    });
    res.status(200).json({ htmlContent });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error! Unable to get preview.",
      error: err.message,
    });
  }
};

export const testSendNewsletter = async (req, res) => {
  try {
    const { newsletter, email } = req.body;
    await sendNewsletter(newsletter, "", email);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log("thrown error", error);
    res.status(500).json({
      message: "Server Error! Unable to send newsletter.",
      error: error.message,
    });
  }
};

// Run scheduler every minute
cron.schedule("* * * * *", async () => {
  try {
    const currentTimestamp = Date.now();
    // console.log(
    //   `Cron job running at: ${new Date(currentTimestamp).toLocaleString()}`,
    // );

    // Find scheduled emails that are due to be sent
    const scheduledNewslettersDue = await ScheduledNewsletterModel.find({
      scheduledTime: { $lte: currentTimestamp },
      status: "SCHEDULED",
    });

    // Send the due emails
    scheduledNewslettersDue.forEach(async (scheduledNewsletter) => {
      try {
        await sendNewsletter(
          scheduledNewsletter,
          "Yiying",
          "yowyiying@gmail.com",
        );
        // console.log("Sending due email...");
        // const preSignedUrl =
        //   scheduledNewsletter.photo &&
        //   (await s3GetImages(scheduledNewsletter.photo));
        // //console.log("presigned url", preSignedUrl);

        // await sendMail(
        //   createCustomEdmMailOptions(
        //     {
        //       name: "Yiying",
        //       email: "yowyiying@gmail.com",
        //     },
        //     scheduledNewsletter.subject,
        //     scheduledNewsletter.messageBody,
        //     preSignedUrl,
        //   ),
        // );
        await ScheduledNewsletterModel.findByIdAndUpdate(
          scheduledNewsletter._id,
          {
            status: "SENT",
          },
        );
      } catch (error) {
        console.error(`Error sending scheduled email: ${error.message}`);
        await ScheduledNewsletterModel.findByIdAndUpdate(
          scheduledNewsletter._id,
          {
            status: "FAILED",
            errorLog: error.message,
          },
        );
      }
    });
  } catch (error) {
    console.error(`Cron job error: ${error.message}`);
  }
});
