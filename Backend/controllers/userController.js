const userModel = require("../models/userModel");

const getUsers = async function (req, res) {
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
};

module.exports = { getUsers };
