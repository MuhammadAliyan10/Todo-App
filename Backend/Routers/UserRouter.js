const express = require("express");
const router = express.Router();
const UserModel = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../Middleware/Auth.js");
require("dotenv").config();

router.get("/getUser", Auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    newUser.save();
    res.status(200).json({ message: "New user added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "No user found." });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }
    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ status: 200, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
