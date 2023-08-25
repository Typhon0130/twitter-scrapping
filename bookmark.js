import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import fs from "fs";
import csvWriter from "csv-write-stream";
import dotenv from "dotenv";
dotenv.config(".env");

/**
 * * Important Information is hightlighted
 * !
 * ?
 * TODO:
 * @param
 */

import { Client, auth } from "twitter-api-sdk";
import Readline from "readline";

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Helper function to parse callback
const getQueryStringParams = (query) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split(/[\?\&]/)
        .reduce((params, param) => {
          let [key, value] = param.split("=");
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          return params;
        }, {})
    : {};
};

//Helper terminal input function
async function input(prompt) {
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CLIENT_ID='YOUR-CLIENT-ID'
// export CLIENET_SECRET='YOUR-CLIENT-SECRET'
const CLIENT_ID = process.env.ClientID;
const CLIENT_SECRET = process.env.ClientSecret;

// Optional parameters for additional payload data
const params = {
  expansions: "author_id",
  "user.fields": ["username", "created_at"],
  "tweet.fields": ["geo", "entities", "context_annotations"],
};

(async () => {
  const authClient = new auth.OAuth2User({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    callback: "https://twitter-scrapping-platform.vercel.app/",
    scopes: ["tweet.read", "users.read", "bookmark.read"],
  });

  const client = new Client(authClient);
  const STATE = "my-state";

  //Get authorization
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge: "challenge",
  });

  console.log(`Please go here and authorize:`, authUrl);

  //Input users callback url in termnial
  const redirectCallback = await input("Paste the redirected callback here: ");

  try {
    //Parse callback
    const { state, code } = getQueryStringParams(redirectCallback);
    if (state !== STATE) {
      console.log("State isn't matching");
    }
    //Gets access token
    await authClient.requestAccessToken(code);

    // //Get the user ID
    const {
      data: { id },
    } = await client.users.findMyUser();

    //Makes api call
    const getBookmark = await client.bookmarks.getUsersIdBookmarks(id, params);
    console.dir(getBookmark, {
      depth: null,
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
})();
