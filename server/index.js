const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 7777;
const VideoRequestData = require("./data/video-requests.data");
const UserData = require("./data/user.data");
const cors = require("cors");
const mongoose = require("./models/mongo.config");
// const multer = require("multer");
if (!Object.keys(mongoose).length) return;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.send("Welcome to semicolon academy APIs, use /video-request to get data")
);
app.use(express.json());
// const upload = multer();
app.post("/video-request", async (req, res, next) => {
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  // res.redirect(`http://localhost:5500`);
  next();
});

app.get("/video-request", async (req, res, next) => {
  let { sortType, searchQuery } = req.query;
  let data = searchQuery
    ? await VideoRequestData.searchRequests(searchQuery)
    : await VideoRequestData.getAllVideoRequests();
  if (sortType === "top_voted") {
    data = data.sort((prev, next) => {
      let prevVotes = prev.votes.ups - prev.votes.downs;
      let nextVotes = next.votes.ups - next.votes.downs;
      return prevVotes < nextVotes ? 1 : -1;
    });
  }
  res.send(data);
  next();
});

app.get("/users", async (req, res, next) => {
  const response = await UserData.getAllUsers(req.body);
  res.send(response);
  next();
});

app.post("/users/login", async (req, res, next) => {
  const response = await UserData.createUser(req.body);
  res.redirect(`http://localhost:5500?id=${response._id}`);
  next();
});

app.use(express.json());

app.put("/video-request/vote", async (req, res, next) => {
  // console.log(req.body);
  const { id, vote_type } = req.body;
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type);
  res.send(response.votes);
  next();
});

app.put("/video-request", async (req, res, next) => {
  const { id, status, resVideo } = req.body;

  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
});

app.delete("/video-request", async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
