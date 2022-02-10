const mongoose = require("mongoose");
const { Song } = require("./song.js");
const { User } = require("./User.js");
const { Playlist } = require("./Playlist.js");

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  return await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const models = { Song, User, Playlist };
module.exports = { connectDB, models };
