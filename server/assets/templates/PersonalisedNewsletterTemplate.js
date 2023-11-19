import fs from "fs";

export const PersonalisedNewsletterTemplate = ({
  recipientName,
  messageBody,
  preSignedPhoto,
  forEmail,
  activities,
}) => {
  const BASE_URL = "http://localhost:3001";

  const greeting = `Hello, ${recipientName}!`;
  const signature = `Best Regards,<br/>Gleek Team`;
  const defaultImagePath = "../server/assets/email/DefaultNewsletterImage.jpg";
  const imageBuffer = fs.readFileSync(defaultImagePath);
  const base64Image = imageBuffer.toString("base64");
  const defaultImageSrc = `data:image/jpeg;base64,${base64Image}`;

  const defaultActivitySampleImage =
    "../server/assets/email/ActivitySampleImage.jpg";
  const activityImageBuffer = fs.readFileSync(defaultActivitySampleImage);
  const base64ActivityImage = activityImageBuffer.toString("base64");
  const defaultActivitySampleImageSrc = `data:image/jpeg;base64,${base64ActivityImage}`;

  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum felis id auctor auctor. Donec tristique porta diam, id pretium tellus suscipit at. Mauris efficitur tempus tortor, ac eleifend lorem aliquet ac.";
  const defaultActivities = [
    {
      title: "Sample Activity 1",
      description: loremIpsum,
      imageSrc: defaultActivitySampleImageSrc,
    },
    {
      title: "Sample Activity 2",
      description: loremIpsum,
      imageSrc: defaultActivitySampleImageSrc,
    },
    {
      title: "Sample Activity 3",
      description: loremIpsum,
      imageSrc: defaultActivitySampleImageSrc,
    },
  ];

  let imgSrc;
  if (forEmail) {
    imgSrc = "cid:newsletter-image";
    for (const activity of activities) {
      activity.imageSrc = `cid:${activity._id}-image`;
    }
  } else {
    imgSrc =
      preSignedPhoto !== "undefined"
        ? `"${preSignedPhoto}"`
        : `"${defaultImageSrc}"`;
  }

  const generateActivitySection = (activity) => {
    return `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${activity.imageSrc}" alt="${activity.title}" style="max-width: 200px; margin-right: 20px;" />
        <div>
          <h3>${activity.title}</h3>
          <p>${activity.description}</p>
          <a href="${BASE_URL}/shop/activity/${activity._id}" target="_blank">View more details</a>
        </div>
      </div>
    `;
  };

  const activitiesToDisplay = activities ? activities : defaultActivities;

  const activitiesSection = activitiesToDisplay
    .map((activity) => generateActivitySection(activity))
    .join("");

  return `
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
        .content img {
          max-width: 100%;
          height: auto;
        }
        .activities {
          padding: 20px;
        }
        .activitiesHeader {
          background-color: #5c4b99;
          color: #ffffff;
          padding: 3px;
          margin-bottom: 20px;
          text-align: center;
          border-radius: 5px 5px 5px 5px;
        }
        .button {
          display: block;
          margin: 20px 50px;
          text-decoration: none;
          background-color: #5c4b99;
          color: #ffffff;
          padding: 10px;
          text-align: center;
          border-radius: 5px;
        }
        .button:link,
        .button:visited,
        .button:hover,
        .button:active {
          color: #ffffff;
          text-decoration: none;
        }
        p {
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #555555;
          background-color: #EAEAEA;
          padding: 10px;
          border-radius: 0 0 5px 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Gleek</h1>
        </div>
        <div class="content">
          <p>${greeting}</p>
          <p>
            ${messageBody}
          </p>
          <img src=${imgSrc} alt="Gleek Newsletter Image" />
        </div>
        <div class="activities">
          <div class="activitiesHeader">
            <h2>Activities For Your Employees</h2>
          </div>
          ${activitiesSection}
        </div>
        <a href= ${BASE_URL}/login>
        <span class="button">
          Go to Gleek
          </span>
        </a>
          <p>
            ${signature}
          </p>
        </div>
        <div class="footer">
          <p>
            If you no longer wish to receive emails from Gleek, you can
            <a href=${BASE_URL}/settings/privacy>unsubscribe here</a>.
          </p>
        </div>
      </div>
    </body>
  </html>

  `;
};
