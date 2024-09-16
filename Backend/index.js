const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ws = require("ws");
const messageModel = require("./models/messageModel");

dotenv.config();

const PORT = process.env.PORT || 3000;

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

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/messages", require("./routes/messageRoutes"));

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize WebSocket server with the HTTP server instance
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          online: wss.clients.map((c) => ({
            userId: c.userId,
            username: c.username,
            name: c.name,
          })),
        })
      );
    });
  }

  // Reading the name, username, id from the cookie for connection establishment
  const cookies = req.headers.cookie;

  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
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

          notifyAboutOnlinePeople();
        });
      }
    }
  }

  connection.on("message", async (message) => {
    try {
      const messageData = JSON.parse(message.toString());

      const { recipient, text } = messageData;
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
});

wss.on("close", (data) => {
  console.log("Disconnected", data);
});
