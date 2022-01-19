const express = require("express");
const router = express.Router();
const Song = require("../models/song");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  console.log(req.body);
  let newSong = await new Song({ ...req.body }).save();
  res.send(newSong);
});

router.get("/", async (req, res) => {
  let songsList = await Song.find();
  res.send(songsList);
});

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// router.delete("/:title", authJWT, async (req, res) => {
//   let song = await Song.findOne({ title: req.params.title });
//   if (!song) return res.status(400);
//   if (req.user.username === song.user) {
//     const deletedSong = await Song.deleteOne({ title: req.params.title });
//     return res.send({ message: "OK", deletedSong });
//   }
//   return res.status(401);
// });

router.delete("/", async (req, res) => {
  console.log(req.body);
  const deletedSong = await Song.deleteOne({ id: req.body });
  return res.send({ message: "OK", deletedSong });
});

module.exports = router;
