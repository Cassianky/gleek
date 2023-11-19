import fs from "fs";

export const NewsletterTemplate = ({
  recipientName,
  messageBody,
  preSignedPhoto,
  forEmail,
}) => {
  const greeting = `Hello, ${recipientName}!`;
  const signature = `Best Regards,<br/>Gleek Team`;
  const defaultImagePath = "../server/assets/email/DefaultNewsletterImage.jpg";
  const imageBuffer = fs.readFileSync(defaultImagePath);
  const base64Image = imageBuffer.toString("base64");

  const defaultImageSrc = `data:image/jpeg;base64,${base64Image}`;

  let imgSrc;
  if (forEmail) {
    imgSrc = "cid:newsletter-image";
  } else {
    imgSrc =
      preSignedPhoto !== "undefined"
        ? `"${preSignedPhoto}"`
        : `"${defaultImageSrc}"`;
  }

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
        img {
          max-width: 100%;
          height: auto;
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
