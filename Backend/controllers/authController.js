const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async function (req, res) {
  const { name, username, password, confirmPassword } = req.body;

  try {
    if (!name || !username || !password || !confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "All the fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "Password should be atleast 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords do not match",
      });
    }

    const userExists = await userModel.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        error: true,
        message: "User already exists",
      });
    }

    bcrypt.genSalt(10, async (err, salt) => {
      if (err)
        return res.status(500).json({ error: true, message: err.message });

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err)
          return res.status(500).json({ error: true, message: err.message });

        try {
          const user = await userModel.create({
            name,
            username,
            password: hash, // Hashed password
          });

          // Generate JWT token
          const token = jwt.sign(
            { userId: user._id, username: user.username, name: user.name },
            process.env.JWT_SECRET
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
          });

          return res.status(200).json({
            error: false,
            message: "User created successfully",
            username: user.username,
            userId: user._id,
            name: user.name,
            token,
          });
        } catch (err) {
          return res.status(500).json({
            error: true,
            message: err.message,
          });
        }
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const login = async function (req, res) {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, name: user.name },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      error: false,
      message: "Login successfull",
      userId: user._id,
      username: user.username,
      name: user.name,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const profile = async function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "No token",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid token",
      });
    }
    return res.json(userData);
  });
};

const logout = function (req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.status(200).send({
    error: false,
    message: "Logout Successfull",
  });
};

module.exports = { login, logout, profile, register };
