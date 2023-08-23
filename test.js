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

const client = new TwitterApi(`${process.env.BearerToken}`);

const rwClient = client.readWrite;

const recipient_id = 2890133000;

await rwClient.v2.sendDmToParticipant(`${recipient_id}`, {
  text: "Hello! Now I am using Twitter API v2",
});
