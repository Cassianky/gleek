import { s3GetImages } from "../service/s3ImageServices.js";
import sendMail from "../util/sendMail.js";
import { createCustomEdmMailOptions } from "../util/sendMailOptions.js";

export const sendNewsletter = async (newsletter, name, email) => {
  try {
    console.log("Sending newsletter to " + name + " at " + email);
    const preSignedUrl =
      newsletter.photo && (await s3GetImages(newsletter.photo));
    //console.log("presigned url", preSignedUrl);

    await sendMail(
      createCustomEdmMailOptions(
        {
          name: name,
          email: email,
        },
        newsletter.subject,
        newsletter.messageBody,
        preSignedUrl
      )
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
