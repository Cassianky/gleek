// token.js

import { google } from "googleapis";
import credentials from "./credentials.json" assert { type: "json" };
import path from "path";
import process from "process";
import fs from "fs";

// Replace with the code you received from Google
const code =
  "4/0AfJohXmRAMv2uYoVekxnCWr5U5lMs-i8mjcJQFu_WosqFu1tAuf1P5FccTcmS4sG3iGkLg";

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
