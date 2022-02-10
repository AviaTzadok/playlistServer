const mongoose = require("mongoose");
const PlaylistSchema = new mongoose.Schema({
  PlaylistName: { type: String, required: true },
  playlistImag: { type: String },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  songs: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Song",
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
