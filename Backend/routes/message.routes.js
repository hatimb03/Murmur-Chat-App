const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controller/message.controller.js");
const protectRoute = require("../middleware/protectRoute.js");

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
