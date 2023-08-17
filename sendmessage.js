import Twitter from "twitter-lite";
import dotenv from "dotenv";
import Twit from "twit";
dotenv.config(".env");

// Specify your API keys and access tokens
const consumerKey = process.env.consumerKey;
const consumerSecret = process.env.consumerSecret;
const accessToken = process.env.accessToken;
const accessTokenSecret = process.env.accessTokenSecret;

const T = new Twit({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token: accessToken,
  access_token_secret: accessTokenSecret,
});

const stream = T.stream("user");

const SendMessage = (user) => {
  const { screen_name, name } = user.source;

  const obj = {
    screen_name: screen_name,
    text: "Hi there!",
  };
  timeout = 5000;
  setTimeout(() => {
    T.post("direct_messages/new", obj)
      .catch((err) => {
        console.error("error", err.stack);
      })
      .then((result) => {
        console.log(`Message sent successfully To  ${screen_name}!`);
      });
  }, timeout);
};
user = new Object();
user.source = { screen_name: "name", name: "userDisplayedName" };
SendMessage(user);
