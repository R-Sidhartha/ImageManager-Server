const multer = require("multer");
const Image = require("../models/ImageModel");
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "Uploads/images");
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single("image");

exports.addImage = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, folder } = req.body;
    const imageUrl = `/${req.file.filename}`;

    const image = new Image({
      name,
      imageUrl,
      user: req.user._id,
      folder,
    });

    const createdImage = await image.save();
    res.status(201).json(createdImage);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id });
    res.json(images);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getImagesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const images = await Image.find({ user: req.user._id, folder: folderId });
    res.json(images);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchImages = async (req, res) => {
  try {
    const { query } = req.query;
    const { folderId } = req.params;

    // Check if folderId is provided
    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }

    // Search or fetch images based on query parameter
    let images;
    if (query) {
      images = await Image.find({
        user: req.user._id,
        folder: folderId,
        name: { $regex: query, $options: "i" },
      });
    } else {
      images = await Image.find({
        user: req.user._id,
        folder: folderId,
      });
    }

    // Check if images are found
    if (images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    res.json(images);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findOneAndDelete({
      _id: imageId,
      user: req.user._id,
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Remove image file from the file system
    const imagePath = path.join(
      __dirname,
      "..",
      "Uploads",
      "images",
      image.imageUrl.split("/").pop()
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateImageName = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { name } = req.body;

    const image = await Image.findOneAndUpdate(
      { _id: imageId, user: req.user._id },
      { name },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(image);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
