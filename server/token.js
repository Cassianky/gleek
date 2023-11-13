// token.js

import { google } from "googleapis";
import credentials from "./credentials.json" assert { type: "json" };
import path from "path";
import process from "process";
import fs from "fs";

// Replace with the code you received from Google
const code =
  "4/0AfJohXl_fMXpFG95YiZuSxkDbeH6dvcJtG4M8Qge6oOa0U5YUB1pS5hb1LolRxMdo0SWVw";

// const code =
//   "4/0AfJohXlQSplw-TkJPxPcnb1euQ7_a_E5FXnH8z1mAVC7WMXQSW8GsZBpcMhWjOubW8Y_Kw";

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0],
);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(process.cwd(), "token.json");
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log("Access token and refresh token stored to token.json");
});
