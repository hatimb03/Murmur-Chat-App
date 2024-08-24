const express = require("express");
const { getUsersForSidebar } = require("../controller/user.controller.js");
const protectRoute = require("../middleware/protectRoute.js");

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

module.exports = router;
