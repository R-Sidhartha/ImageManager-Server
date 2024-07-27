const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
