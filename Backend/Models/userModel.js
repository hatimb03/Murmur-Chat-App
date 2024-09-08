const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
