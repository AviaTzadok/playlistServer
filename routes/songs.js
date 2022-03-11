const express = require("express");
const router = express.Router();
const Song = require("../models/song");
const Playlist = require("../models/Playlist");
const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  console.log("555555555555555555555555555555555555555");
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.user = user._id;
      console.log(req.body.user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.post("/", authJWT, async (req, res) => {
  try {
    let song = await Song.findOne({
      id: req.body.name.id,
    });
    if (!song) {
      //במקרה שהשיר לא קיים במערכת

      let newSong = await new Song({
        id: req.body.name.id,
        title: req.body.name.title,
        image: req.body.name.image,
      }).save();
      let idSong = await Song.findOne({ id: req.body.name.id });

      //****************************************************************************** */

      let arrSongs = await Playlist.findOne({ _id: req.body.playlistID });
      if (arrSongs.songs.length == 0) {
        const updatePlaylistImag = await Playlist.findOneAndUpdate(
          {
            _id: req.body.playlistID,
            user: req.body.user,
          },
          { $set: { playlistImag: req.body.name.image } },
          {
            new: true,
          }
        );
      }

      //************************************************************************ */

      const updatePlaylist = await Playlist.findOneAndUpdate(
        {
          _id: req.body.playlistID,
          user: req.body.user,
        },
        { $push: { songs: idSong._id } },
        {
          new: true,
        }
      ).populate("songs");

      res.send(idSong);
    } else {
      //****************************************************************************** */

      let arrSongs = await Playlist.findOne({ _id: req.body.playlistID });
      if (arrSongs.songs.length == 0) {
        const updatePlaylistImag = await Playlist.findOneAndUpdate(
          {
            _id: req.body.playlistID,
            user: req.body.user,
          },
          { $set: { playlistImag: req.body.name.image } },
          {
            new: true,
          }
        );
      }

      //************************************************************************ */

      //במקרה שהשיר קיים במערכת
      //צריך לעשות בדיקה אם השיר לא קיים כבר בפליליסט
      let idSong = await Song.findOne({ id: req.body.name.id });
      let ifExists = await Playlist.findOne({
        _id: req.body.playlistID,
        user: req.body.user,
        songs: idSong,
      });
      if (!ifExists) {
        const updatePlaylist = await Playlist.findOneAndUpdate(
          {
            _id: req.body.playlistID,
            user: req.body.user,
          },
          { $push: { songs: idSong._id } },
          {
            new: true,
          }
        ).populate("songs");
        res.send(idSong);
      } else {
        console.log("already exists");
      }
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/:myPlaylist", authJWT, async (req, res) => {
  try {
    console.log(req.params.myPlaylist);
    const playlist = await Playlist.findOne({
      id: req.params.myPlaylist,
      user: req.body.user,
    }).populate("songs");

    if (playlist) {
      res.send(playlist.songs);
    } else {
      res.send([]);
    }
  } catch (err) {
    res.send(err);
  }
});

router.delete("/", authJWT, async (req, res) => {
  try {
    let obj = JSON.stringify(req.body);
    obj = JSON.parse(obj);

    const playlists = await Playlist.findOne({
      user: req.body.user,
      _id: obj.playlistID,
    }).select("songs");

    const index = playlists.songs.indexOf(obj.id);
    if (index > -1) {
      playlists.songs.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(playlists.songs);

    const newPlaylists = await Playlist.findByIdAndUpdate(
      obj.playlistID,
      { songs: playlists.songs },
      {
        new: true,
      }
    );

    console.log(playlists);

    console.log(obj.id);

    const sendPlaylists = await Playlist.findOne({
      _id: obj.playlistID,
    }).populate("songs");
    res.send(sendPlaylists.songs);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
