const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageController");

router.get("/:userId", getMessages);

module.exports = router;
