const userModel = require("../models/user.model.js");

module.exports.getUsersForSidebar = async function (req, res) {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await userModel
      .find({
        _id: { $ne: loggedInUserId },
      })
      .select("-password");

    return res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.log("Error in getting all users controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
