const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");

const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.user = user._id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/allPlaylistImg", authJWT, async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.body.user,
    });
    console.log(playlists);
    res.send(playlists);
  } catch (e) {
    console.log(e);
    res.status(500).json({ massage: "internal server error" });
  }
});

router.post("/playlist", authJWT, async (req, res) => {
  const playlist = await new Playlist({
    PlaylistName: req.body.name,
    playlistImag: "",
    user: req.body.user,
    songs: [],
  }).save();
  res.send(JSON.stringify(playlist));
});

router.get("/playlist/:id", authJWT, async (req, res) => {
  try {
    const playlistId = await req.params.id;
    console.log(playlistId);
    const playlist = await Playlist.findOne({
      _id: playlistId,
    }).populate("songs");
    console.log(playlist.songs);
    res.send(playlist.songs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ massage: "internal server error" });
  }
});

module.exports = router;
