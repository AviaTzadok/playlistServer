const mongoose = require("mongoose");
const songSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  provider: { type: String },
});
const Song = mongoose.model("Song", songSchema);
module.exports = Song;
