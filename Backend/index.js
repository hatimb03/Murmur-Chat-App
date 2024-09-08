const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userModel = require("./Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ws = require("ws");

const PORT = 3000;

dotenv.config();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", function (req, res) {
  res.send("Hello");
});

app.post("/register", async function (req, res) {
  const { name, username, password, confirmPassword } = req.body;

  try {
    if (!name || !username || !password || !confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "All the fields are required",
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
          res.cookie("token", token, { httpOnly: true });

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
});

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "No user found",
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
});

app.get("/profile", (req, res) => {
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
});

// app.get("/logout", function (req, res) {
//   res.cookie(token, "", {
//     httpOnly: true,
//   });

//   return res.status(200).json({
//     error: false,
//     message: "Logout successfull",
//   });
// });

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  //reading the name, username, id from the cookie for connection establishment
  const cookies = req.headers.cookie;

  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token=")); //.split to segregate if many cookies are presenet
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) {
            console.log("Web socket error", err.message);
            connection.close();
            return;
          }

          const { name, username, userId } = userData;
          connection.name = name;
          connection.username = username;
          connection.userId = userId;
        });
      }
    }
  }

  connection.on("message", (message) => {
    try {
      const messageData = JSON.parse(message.toString());

      const { recipient, text } = messageData;
      if (recipient && text) {
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) => {
            c.send(JSON.stringify({ text, sender: connection.userId }));
          });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  //Showing online poeple
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
          name: c.name,
        })),
      })
    );
  });
});
