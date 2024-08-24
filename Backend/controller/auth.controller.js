const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("../utils/generateToken");

module.exports.signup = async function (req, res) {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!username || !password || !fullName || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All the fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await userModel.findOne({ username: username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    //Hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
    }

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      gender: newUser.gender,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.login = async function (req, res) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both username and password" });
    }

    const isUser = await userModel.findOne({ username });

    if (!isUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, isUser.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (isMatch) generateTokenAndSetCookie(isUser._id, res); //setting the cookie if the credentials are correct
    res.status(200).json({
      _id: isUser._id,
      fullName: isUser.fullName,
      gender: isUser.gender,
      profilePic: isUser.profilePic,
    });
  } catch (error) {
    console.log("error in login controller", error.message);

    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.logout = function (req, res) {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log("error in login controller", error.message);

    res.status(500).json({ error: "Internal server error" });
  }
};
