import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config(".env");

const consumerKey = process.env.consumerKey;
const consumerSecret = process.env.consumerSecret;

const client = new TwitterApi({
  clientId: consumerKey,
  clientSecret: consumerSecret,
});
const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
  "<CALLBACK_URL>",
  {
    scope: [
      "tweet.read",
      "users.read",
      "dm.read",
      "dm.write",
      "offline.access",
    ],
  }
);

const {
  client: loggedClient,
  accessToken,
  refreshToken,
} = await client.loginWithOAuth2({
  code,
  codeVerifier,
  redirectUri: "https://twitter-scrapping-platform.vercel.app/",
});

await client.v1
  .sendDm({
    recipient_id: "2890133000",
    text: "Hello, have a great day :)",
    attachment: { type: "media", media: "hi" },
  })
  .then((response) => {
    console.log(response, "````````````````");
  })
  .catch((err) => console.log(err, "err"));
