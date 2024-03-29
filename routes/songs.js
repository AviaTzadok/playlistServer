const express = require("express");
const router = express.Router();
const Song = require("../models/song");
const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  console.log("111111111111111111111");
  console.log(req.headers.authorization);
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

router.post("/", authJWT, async (req, res) => {
  let song = await Song.findOne({
    id: req.body.id,
    user: req.body.user,
  });
  if (!song) {
    let newSong = await new Song({ ...req.body }).save();
    console.log(newSong);
    res.send(newSong);
  } else {
    res.send(false);
  }
});

router.get("/", authJWT, async (req, res) => {
  let songsList = await Song.find({ user: { $ne: req.body.user } });

  // let songsList = await Song.find({});
  console.log(songsList);
  res.send(songsList);
});

router.get("/:myPlaylist", authJWT, async (req, res) => {
  let songsList = await Song.find({ user: req.body.user });
  res.send(songsList);
});

router.delete("/", authJWT, async (req, res) => {
  let song = await Song.findOne({
    id: req.body,
    user: req.body.user,
  });
  console.log("song", song);
  if (song) {
    const deletedSong = await Song.deleteOne({
      id: req.body,
      user: req.body.user,
    });
    let songsList = await Song.find({ user: req.body.user });
    console.log({ message: "OK", deletedSong });
    res.send(songsList);
  } else {
    return res.status(401).send(false);
  }
});

module.exports = router;
