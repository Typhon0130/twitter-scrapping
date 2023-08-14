import axios from "axios";
import fs from "fs";
import csvWriter from "csv-write-stream";

// Specify your API keys and access tokens
const consumerKey = "";
const consumerSecret = "";
const accessToken = "";
const accessTokenSecret = "";

// Specify the screen name of the Twitter user (your username)
const screenName = "thesaasacademy";

var test;

const handleGetLikingUsers = async (tweet_id) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/tweets/${tweet_id}/liking_users`,
      {
        headers: {
          Authorization: `Bearer ${test}`,
        },
      }
    );
    const data = response.data.meta.result_count;
    return data;
  } catch (err) {
    throw err;
  }
};

const handleGetRetweets = async (tweet_id) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/tweets/${tweet_id}/retweeted_by`,
      {
        headers: {
          Authorization: `Bearer ${test}`,
        },
      }
    );
    const data = response.data;
    console.log(data);
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
      test = response.data.access_token;

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
      return axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
        headers: {
          Authorization: `Bearer ${test}`,
        },
      });
    })
    .then(async (response) => {
      const tweetData = response.data.data;
      // Prepare CSV file for storing tweet data
      const csvWriterInstance = csvWriter({
        headers: ["Tweet ID", "EDIT_ID", "Full Text", "Liking User"],
      });

      csvWriterInstance.pipe(fs.createWriteStream("./tweet_history.csv"));

      // Write tweet data to CSV file
      for (let i = 0; i < tweetData.length; i++) {
        const tweet = tweetData[i];
        const liking_user = await handleGetLikingUsers(tweet.id);
        const retweets = await handleGetRetweets(tweet.id);
        csvWriterInstance.write([
          tweet.id,
          tweet.edit_history_tweet_ids[0],
          tweet.text,
          liking_user,
        ]);
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
