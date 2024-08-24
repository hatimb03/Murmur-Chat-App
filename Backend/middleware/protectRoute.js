const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    if (!verify) {
      return res.status(400).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await userModel.findById(verify.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protect route", error.message);
    res.status(500).json({ error: "Internal server errror" });
  }
};

module.exports = protectRoute;
