const mongoose = require("mongoose");
require("dotenv").config();
const mongodbURI = process.env.DATABASE;
async function main() {
  try {
    await mongoose.connect(mongodbURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

module.exports = main;
