const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const key = require("./API_KEY").YOUTUBE_KEY;

const axiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 5,
    key: key,
  },
  headers: {},
});

router.get("/:songToSearch", async (req, res) => {
  const response = await axiosInstance.get("/search", {
    params: {
      q: req.params.songToSearch,
    },
  });
  res.send(response.data);
});

module.exports = router;
