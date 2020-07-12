const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");

const PORT = process.env.PORT || 1212;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

const getRepos = async (req, res, next) => {
  try {
    console.log("Fetching Data...");
    const { username } = req.params;
    const resp = await fetch(`https://api.github.com/users/${username}`);
    const data = await resp.json();
    client.setex(username, 3600, data.public_repos);
    res.send(`${username} has ${data.public_repos} public repos`);
  } catch (error) {
    res.send(500);
  }
};

const cache = (req, res, next) => {
  const { username } = req.params;
  client.get(username, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(500);
    } else {
      if (data !== null) {
        console.log("Serving from cache");
        return res.send(`${username} has ${data} public repos`);
      }
      next();
    }
  });
};

app.get("/repos/:username", cache, getRepos);

app.listen(PORT, () => {
  console.log(`App listening @ ${PORT}`);
});
