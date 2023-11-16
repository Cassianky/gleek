// token.js

import { google } from "googleapis";
import credentials from "./credentials.json" assert { type: "json" };
import path from "path";
import process from "process";
import fs from "fs";

// Replace with the code you received from Google
const code =
  "4/0AfJohXln8NAQVxuEfNmuK4J-Fyjc2ikTwXQqxnKu_XGljmrnEGOy0eIdf0IeWpFxrPiy6g";

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
