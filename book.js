import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import fs, { stat } from "fs";
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

// const recipient_id = 2890133000;

// const client = new TwitterApi({
//   appKey: process.env.consumerKey,
//   appSecret: process.env.consumerSecret,
//   accessToken: process.env.accessToken,
//   accessSecret: process.env.accessTokenSecret,
// });

const client = new TwitterApi({
  clientId: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
});

const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
  "https://twitter-scrapping-platform.vercel.app",
  {
    scope: [
      "tweet.read",
      "users.read",
      "offline.access",
      "bookmark.read",
      "bookmark.write",
    ],
  }
);

console.log(codeVerifier, "~~~~~~~~~~~~~~~", state);

const bookmarks = await client.v2.bookmarks("2890133000", {
  expansions: ["referenced_tweets.id"],
});

for await (const bookmark of bookmarks) {
  const quotedTweet = bookmarks.includes.quote(bookmark);

  if (quotedTweet) {
    console.log(
      "Bookmarked tweet",
      bookmark.id,
      "is a quote of",
      quotedTweet.id
    );
  }
}
