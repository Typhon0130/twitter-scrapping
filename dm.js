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

// const client = new TwitterApi(`${process.env.accessToken}`);

// const rwClient = client.readWrite;

const recipient_id = 2890133000;

// await rwClient.v2.sendDmToParticipant(`${recipient_id}`, {
//   text: "Hello! Now I am using Twitter API v2",
// });

// const clien1 = new TwitterApi(`${process.env.accessToken}`);
const client1 = new TwitterApi({
  appKey: process.env.consumerKey,
  appSecret: process.env.consumerSecret,
  accessToken: process.env.accessToken,
  accessSecret: process.env.accessTokenSecret,
});

// await client1.v1.sendDm({
//   recipient_id: "2890133000",
//   text: "Hello",
// });

// await client1.v2.sendDmToParticipant(`${recipient_id}`, {
//   text: "Hello! Now I am using Twitter API v2",
// });

const { dm_conversation_id, dm_event_id } =
  await client1.v2.sendDmToParticipant("2890133000", {
    text: "Hello! Now I am using Twitter API v2",
  });

console.log(dm_conversation_id, dm_event_id);
