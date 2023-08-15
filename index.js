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

// Specify the screen name of the Twitter user (your username)
const screenName = "thesaasacademy";

var Bearerlocaltoken;

// Get the liked Users count for each tweet
const handleGetLikingUsers = async (tweet_id) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/tweets/${tweet_id}/liking_users?user.fields=name,username,description`,
      {
        headers: {
          Authorization: `Bearer ${Bearerlocaltoken}`,
        },
      }
    );
    const count = await response.data.meta.result_count;
    const data = await response.data.data;
    // console.log(data, count);
    return {
      count,
      data,
    };
  } catch (err) {
    throw err;
  }
};

// Get the Retweets for each tweet
const handleGetRetweets = async (tweet_id) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/tweets/${tweet_id}/retweeted_by`,
      {
        headers: {
          Authorization: `Bearer ${Bearerlocaltoken}`,
        },
      }
    );
    const data = response.data.meta.result_count;
    return data;
  } catch (err) {
    throw err;
  }
};

// Get the Impressions for each tweet

// Get the Comments. for each tweet
const handleGetComments = async (tweet_id) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${tweet_id}`,
      {
        headers: {
          Authorization: `Bearer ${Bearerlocaltoken}`,
        },
      }
    );
    const data = response.data.meta.result_count;
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

// Encode consumer key and consumer secret
const encodedCredentials = Buffer.from(
  `${consumerKey}:${consumerSecret}`
).toString("base64");

export const index = () => {
  // Request an OAuth 2 Bearer token
  axios
    .post(
      "https://api.twitter.com/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    )
    .then((response) => {
      const bearerToken = response.data.access_token;
      Bearerlocaltoken = response.data.access_token;

      // Retrieve user ID from screen name
      return axios.get(
        `https://api.twitter.com/2/users/by?usernames=${screenName}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
    })
    .then((response) => {
      const userId = response.data.data[0].id;
      // Retrieve tweet history for the specified user ID
      return axios.get(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=50`,
        {
          headers: {
            Authorization: `Bearer ${Bearerlocaltoken}`,
          },
        }
      );
    })
    .then(async (response) => {
      const tweetData = response.data.data;
      // Prepare CSV file for storing tweet data
      const csvWriterInstance = csvWriter({
        headers: [
          "Tweet ID",
          "Full Text",
          "Liking User",
          "Liked User username",
          "Liked User name",
          "Liked User Description",
        ],
      });

      csvWriterInstance.pipe(fs.createWriteStream("./tweet_history.csv"));

      // Write tweet data to CSV file
      for (let i = 0; i < tweetData.length; i++) {
        const tweet = tweetData[i];
        const liking_user = await handleGetLikingUsers(tweet.id);
        if (liking_user.count != 0) {
          for (let j = 0; j < liking_user.data.length; j++) {
            const liked_user = liking_user.data[j];
            csvWriterInstance.write([
              tweet.id.toString(),
              tweet.text,
              liking_user.count,
              liked_user.name,
              liked_user.username,
              liked_user.description,
            ]);
          }
        } else {
          csvWriterInstance.write([
            tweet.id.toString(),
            tweet.text,
            liking_user.count,
            "",
            "",
            "",
          ]);
        }
      }

      // Close CSV file
      csvWriterInstance.end();
      console.log("Success");
    })
    .catch((error) => {
      console.error(
        "An error occurred:",
        error.response ? error.response.data : error.message
      );
    });
};

index();
