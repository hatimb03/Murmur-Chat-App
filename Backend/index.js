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
const messageModel = require("./Models/messageModel");

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

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return reject("No token provided");
      }

      jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
        if (err) {
          return reject("Invalid token");
        }
        resolve(userData);
      });
    } catch (err) {
      reject(err);
    }
  });
}

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

app.get("/people", async function (req, res) {
  try {
    const users = await userModel.find({}, { _id: 1, username: 1, name: 1 });
    if (!users) {
      return res.status(400).json({
        error: true,
        message: "No users found",
      });
    }
    return res.status(200).json({
      error: false,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
});

app.get("/messages/:userId", async function (req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid userId format",
    });
  }

  try {
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;

    const messages = await messageModel
      .find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
      })
      .sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
      return res.status(200).json({
        error: false,
        message: "No messages found",
        data: [],
      });
    }

    return res.status(200).json({
      error: false,
      messages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  }
});

app.get("/logout", function (req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json(200).send({
    error: false,
    message: "Logout Successfull",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
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
  }

  // connection.isAlive = true;
  // connection.timer = setInterval(() => {
  //   connection.ping();
  //   connection.deathTimer = setTimeout(() => {
  //     connection.isAlive = false;
  //     clearInterval();
  //     connection.terminate();
  //     notifyAboutOnlinePeople();
  //   }, 1000);
  // }, 5000);

  // connection.on("pong", () => {
  //   clearTimeout(connection.deathTimer);
  // });

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

  connection.on("message", async (message) => {
    try {
      const messageData = JSON.parse(message.toString());

      const { recipient, text, file } = messageData;
      if (file) {
        console.log(file);
      } else {
        console.log("No file data found");
      }
      if (recipient && text) {
        const messageDoc = await messageModel.create({
          sender: connection.userId,
          recipient: recipient,
          text: text,
        });
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) => {
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                _id: messageDoc._id,
              })
            );
          });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  //Showing online poeple
  notifyAboutOnlinePeople();
});

wss.on("close", (data) => {
  console.log("Disconnected", data);
});
