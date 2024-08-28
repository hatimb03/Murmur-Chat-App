const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.js");
const messageRoutes = require("./routes/message.routes.js");
const userRoutes = require("./routes/user.routes.js");

const connectToMongodb = require("./db/connectToMongodb");
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", function (req, res) {
//   res.send("hello from /");
// });

app.listen(PORT, () => {
  connectToMongodb(), console.log(`Server is running on the port ${PORT}`);
});
