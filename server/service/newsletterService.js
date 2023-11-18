import ActivityModel from "../model/activityModel.js";
import { TYPE } from "../util/activityTagEnum.js";
import { s3GetImages } from "../service/s3ImageServices.js";
import sendMail from "../util/sendMail.js";
import {
  createCustomEdmMailOptions,
  createPersonalisedNewsletterMailOptions,
} from "../util/sendMailOptions.js";

export const sendNewsletter = async (newsletter, recipient) => {
  try {
    console.log(
      "Sending newsletter to " + recipient.name + " at " + recipient.email
    );
    const preSignedUrl =
      newsletter.photo && (await s3GetImages(newsletter.photo));

    if (newsletter.newsletterType === "PERSONALISED") {
      let activities = [];

      // Check if recipient has preferred activity types
      if (
        recipient.preferredActivityTypes &&
        Object.values(recipient.preferredActivityTypes).some((value) => value)
      ) {
        const preferredActivityTypes = Object.keys(
          recipient.preferredActivityTypes
        )
          .filter((type) => recipient.preferredActivityTypes[type])
          .map((type) => {
            if (type === "POPUP") {
              return ["Popups (Food)", "Popups (Non-food)"];
            }
            return TYPE[type];
          })
          .flat();
        console.log(preferredActivityTypes);

        activities = await ActivityModel.aggregate([
          { $match: { activityType: { $in: preferredActivityTypes } } },
          { $sample: { size: 3 } },
        ]);
      } else {
        // If no preferred activity types, get random selection of activities
        console.log("no preferred activity types");
        activities = await ActivityModel.aggregate([{ $sample: { size: 3 } }]);
      }

      for (const activity of activities) {
        if (activity.images && activity.images.length > 0) {
          // Fetch pre-signed URL for the first image
          const preSignedActivityImage = await s3GetImages(activity.images[0]);
          // Add preSignedActivityImage property to the activity object
          activity.preSignedActivityImage = preSignedActivityImage;
        }
      }

      // if something, get activities of those types and choose 3 random ones
      // if not enough activities, get random selection of activities

      await sendMail(
        createPersonalisedNewsletterMailOptions(
          {
            name: recipient.name,
            email: recipient.email,
          },
          newsletter.subject,
          newsletter.messageBody,
          preSignedUrl,
          activities
        )
      );
    } else {
      await sendMail(
        createCustomEdmMailOptions(
          {
            name: recipient.name,
            email: recipient.email,
          },
          newsletter.subject,
          newsletter.messageBody,
          preSignedUrl
        )
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
