const mongoose = require("mongoose");

const connectToMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("error connecting to mongodb", error);
  }
};

module.exports = connectToMongodb;
