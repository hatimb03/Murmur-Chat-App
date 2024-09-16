const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

router.get("/people", getUsers);

module.exports = router;
