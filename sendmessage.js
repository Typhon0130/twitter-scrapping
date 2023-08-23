import axios from "axios";
import fs from "fs";
import csvWriter from "csv-write-stream";
import dotenv from "dotenv";
dotenv.config(".env");

// Specify your API keys and access tokens
const consumerKey = process.env.consumerKey;
const consumerSecret = process.env.consumerSecret;
const accessToken = process.env.accessToken;
const accessTokenSecret = process.env.accessTokenSecret;

const handleSendDirectMessage = async () => {
  const user_id = 2890133000;
  try {
    console.log(accessToken);
    console.log(accessToken, "~~~~~~~~~~~~~~~~~");

    await axios({
      method: "post",
      url: `https://api.twitter.com/2/dm_conversations/with/${user_id}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.BearerToken}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
      data: {
        text: "Hello World!",
      },
    })
      .then((res) => {
        console.log(1);
        console.log(res);
      })
      .catch((err) => {
        console.log(2);
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return;
  }
};

handleSendDirectMessage();
