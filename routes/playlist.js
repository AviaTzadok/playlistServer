// const express = require("express");
// const router = express.Router();
// const Playlist = require("../models/Playlist");
// const jwt = require("jsonwebtoken");

// const authJWT = (req, res, next) => {
//   console.log("111111111111111111111");
//   console.log(req.headers.authorization);
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.body.user = user._id;

//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// router.post("/", async (req, res) => {
//   const playlist = await new Playlist({
//     PlaylistName: req.body.name,
//     user: req.body.id, // צריך להוסיף, לא תקיןid מונגואי של מי שיצר את הפליליסט,
//     songs: [],
//   }).save();
//   res.send(playlist);
// });
// router.get("/playlist/:playlist", async (req, res) => {
//   try {
//     const platlistName = req.params.playlist;
//     const user = req.body.createdBy;
//     const playlist = await Playlist.findOne({
//       PlaylistName: platlistName,
//       user: user,
//     }).populate("songs");
//     res.send(playlist.songs);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ massege: "internal server error" });
//   }
// });

// module.exports = router;
