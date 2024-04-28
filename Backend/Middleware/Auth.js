const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
require("dotenv").config();

const Auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication failed. No token found.");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Authentication failed. JWT token not verified");
    }
    const user = UserModel.findOne({ _id: decoded.userID });
    if (!user) {
      throw new Error("Authentication failed. No user found.");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Authorization failed. Server error." });
  }
};

module.exports = Auth;
