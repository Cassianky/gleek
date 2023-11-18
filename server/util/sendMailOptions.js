import { NewsletterTemplate } from "../assets/templates/NewsletterTemplate.js";
import { PersonalisedNewsletterTemplate } from "../assets/templates/PersonalisedNewsletterTemplate.js";

export const createClientWelcomeMailOptions = (client) => {
  try {
    const text = `Hello, ${client.name}!`;
    const subject = `${client.name}, welcome to Gleek!`;
    const to = client.email;

    const htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #5c4b99;
          color: #ffffff;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        p {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gleek</h1>
        </div>
        <div class="content">
          <p>${text}</p>
          <img src="cid:welcome-client-image" alt="Welcome to Gleek!" />
          <p>
            An admin will be reviewing your registration shortly. You can continue
            browsing activities, but booking functionality will be limited until
            your account is approved. Thank you.
          </p>
        </div>
      </div>
    </body>
  </html>


  `;

    const options = {
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "ClientWelcome.png",
          path: "../server/assets/email/ClientWelcome.png",
          cid: "welcome-client-image",
        },
      ],
      to,
    };
    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createVerifyEmailOptions = (client, token) => {
  try {
    const to = client.email;
    const message = `You have registered with the email ${client.email} on Gleek.
  Please verify your email by clicking on the link: http://localhost:3001/client/verifyEmail/${token}`;
    const options = {
      to: to,
      subject: "Verify your Email on Gleek",
      text: message,
    };
    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createResendVerifyEmailOptions = (client, token) => {
  try {
    const message = `Hello ${client.email}, you have requested for the verification email to be resent.
    Please verify your email by clicking on the link: http://localhost:3001/client/verifyEmail/${token}`;
    const options = {
      to: client.email,
      subject: "Resend: Verify your Email on Gleek",
      text: message,
    };

    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createVendorWelcomeMailOptions = (vendor) => {
  try {
    const text = `Hello, ${vendor.companyName}!`;
    const subject = `${vendor.companyName}, Welcome to Gleek As a Vendor Partner!`;
    const to = vendor.companyEmail;

    const htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #5c4b99;
          color: #ffffff;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        p {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gleek</h1>
        </div>
        <div class="content">
          <p>${text}</p>
          <img src="cid:welcome-vendor-image" alt="Welcome to Gleek!" />
          <p>
          Thank you for choosing Gleek as your partner in promoting sustainability and wellness employee activities. Let's work together to make workplaces healthier and more sustainable. We appreciate your decision to join our platform. Your registration is received and Admin will be reviewing your registration shortly to complete your registration process.
          </p>
        </div>
      </div>
    </body>
  </html>


  `;

    const options = {
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "VendorWelcome.png",
          path: "../server/assets/email/VendorWelcome.png",
          cid: "welcome-vendor-image",
        },
      ],
      to,
    };
    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createVerifyEmailOptionsVendor = (vendor, token) => {
  try {
    const to = vendor.companyEmail;
    const message = `You have registered with the company email ${vendor.companyEmail} on Gleek.
  Please verify your email by clicking on the link: http://localhost:3001/vendor/verifyEmail/${token}`;
    const options = {
      to: to,
      subject: "Verify your Email on Gleek",
      text: message,
    };
    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createResendVerifyEmailOptionsVendor = (vendor, token) => {
  try {
    const message = `Hello ${vendor.email}, you have requested for the verification email to be resent.
    Please verify your email by clicking on the link: http://localhost:3001/vendor/verifyEmail/${token}`;
    const options = {
      to: vendor.companyEmail,
      subject: "Resend: Verify your Email on Gleek",
      text: message,
    };

    return options;
  } catch (err) {
    console.log(err);
  }
};

export const createResetPasswordEmailOptions = (client, token) => {
  const message = `Please add a new password for your account by clicking on the link: http://localhost:5000/gleek/auth/resetPassword/${token}`;
  const options = {
    to: client.email,
    subject: "Gleek Client: Recover Password",
    text: message,
  };
  return options;
};

export const createResetPasswordEmailOptionsVendor = (vendor, token) => {
  const message = `Please add a new password for your account by clicking on the link: http://localhost:5000/gleek/vendor/resetPassword/${token}`;
  const options = {
    to: vendor.companyEmail,
    subject: "Gleek Vendor: Recover Password",
    text: message,
  };
  return options;
};

// for when admin rejects client / vendor registration
export const createRegistrationApprovalEmailOptions = (user) => {
  console.log("reject called");
  console.log(user.name ?? user.companyName);
  console.log(user.email ?? user.companyEmail);

  const message = `Hi ${
    user.name ?? user.companyName
  }! Your registration for an account with Gleek has been ${
    user.status === "APPROVED" ? "approved" : "rejected"
  }.`;
  const options = {
    to: user.email ?? user.companyEmail,
    subject: "Gleek: Registration",
    text: message,
  };
  return options;
};

// for when admin disables/enables client / vendor account
export const createDisableOrEnableEmailOptions = (user, isDisabled) => {
  console.log("disable/enabled called");
  console.log(user.name ?? user.companyName);
  console.log(user.email ?? user.companyEmail);

  const message = `Hi ${
    user.name ?? user.companyName
  }! Your account with Gleek has been ${isDisabled ? "disabled" : "enabled"}.`;
  const options = {
    to: user.email ?? user.companyEmail,
    subject: "Gleek: Account Status Update",
    text: message,
  };
  return options;
};

export const createCustomEdmMailOptions = (
  client,
  subject,
  messageBody,
  preSignedUrl
) => {
  try {
    console.log("Creating custom newsletter mail options");
    const to = client.email;
    const htmlContent = NewsletterTemplate({
      recipientName: client.name,
      messageBody: messageBody,
      forEmail: true,
    });

    const attachments = [];
    if (preSignedUrl !== undefined) {
      // If preSignedUrl is not null, attach the image using preSignedUrl
      attachments.push({
        filename: "NewsletterImage.png",
        href: preSignedUrl,
        cid: "newsletter-image",
      });
    } else {
      // If preSignedUrl is null, attach an image from the file path
      attachments.push({
        filename: "DefaultNewsletterImage.jpg",
        path: "../server/assets/email/DefaultNewsletterImage.jpg",
        cid: "newsletter-image",
      });
    }
    const options = {
      subject,
      html: htmlContent,
      attachments,
      to,
    };
    return options;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const createPersonalisedNewsletterMailOptions = (
  client,
  subject,
  messageBody,
  preSignedUrl,
  activities
) => {
  try {
    console.log("Creating personalised newsletter mail options");
    const to = client.email;
    const htmlContent = PersonalisedNewsletterTemplate({
      recipientName: client.name,
      messageBody: messageBody,
      forEmail: true,
      activities: activities,
    });

    const attachments = [];
    if (preSignedUrl !== undefined) {
      // If preSignedUrl is not null, attach the image using preSignedUrl
      attachments.push({
        filename: "NewsletterImage.png",
        href: preSignedUrl,
        cid: "newsletter-image",
      });
    } else {
      // If preSignedUrl is null, attach an image from the file path
      attachments.push({
        filename: "DefaultNewsletterImage.jpg",
        path: "../server/assets/email/DefaultNewsletterImage.jpg",
        cid: "newsletter-image",
      });
    }

    for (const activity of activities) {
      if (activity.preSignedActivityImage) {
        attachments.push({
          filename: `${activity.title}_image.png`,
          href: activity.preSignedActivityImage,
          cid: `${activity._id}-image`,
        });
      } else {
        attachments.push({
          filename: "ActivitySampleImage.jpg",
          path: "../server/assets/email/ActivitySampleImage.jpg",
          cid: `${activity._id}-image`,
        });
      }
    }
    const options = {
      subject,
      html: htmlContent,
      attachments,
      to,
    };
    return options;
  } catch (err) {
    console.log(err);
    return err;
  }
};
