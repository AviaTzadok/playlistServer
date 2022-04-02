const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userAlreadyExist = await User.findOne({
      username: req.body.username,
    });

    if (userAlreadyExist) return res.status(401).send("already Exist");
    const user = await new User({
      username: req.body.username,
      password: hashedPassword,
    }).save();

    const accessToken = jwt.sign(
      JSON.stringify(user),
      process.env.TOKEN_SECRET
    );
    user.password = undefined;
    res.json({ accessToken: accessToken, status: "200" });
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        JSON.stringify(user),
        process.env.TOKEN_SECRET
      );
      user.password = undefined;
      res.json({ accessToken: accessToken, status: "200" });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    let users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});
module.exports = router;
