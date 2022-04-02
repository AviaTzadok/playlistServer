const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const key = require("./API_KEY").YOUTUBE_KEY;

const axiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 8,
    key: key,
  },
  headers: {},
});

router.get("/:songToSearch", async (req, res) => {
  try {
    const response = await axiosInstance.get("/search", {
      params: {
        q: req.params.songToSearch,
      },
    });
    res.send(response.data);
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
