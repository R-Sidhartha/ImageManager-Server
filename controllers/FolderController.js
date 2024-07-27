const Folder = require("../models/FolderModel");
const Image = require("../models/ImageModel");
const fs = require("fs");
const path = require("path");

// Function to delete images in a folder
const deleteImagesInFolder = async (folderId) => {
  try {
    const images = await Image.find({ folder: folderId });
    for (const image of images) {
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
      await image.deleteOne();
    }
  } catch (error) {
    console.error(err.message);
  }
};

// Function to delete a folder and its subfolders recursively
const deleteFolderAndSubfolders = async (folderId, userId) => {
  try {
    const subfolders = await Folder.find({
      parentFolder: folderId,
      user: userId,
    });

    for (const subfolder of subfolders) {
      await deleteFolderAndSubfolders(subfolder._id, userId);
    }

    await deleteImagesInFolder(folderId);
    await Folder.findOneAndDelete({ _id: folderId, user: userId });
  } catch (error) {
    console.error(err.message);
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = new Folder({
      name,
      user: req.user._id,
      parentFolder: parentFolder || null,
    });

    const createdFolder = await folder.save();
    res.status(201).json(createdFolder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id });
    res.json(folders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a folder by its ID
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    // Find and delete the folder
    const folder = await Folder.findOneAndDelete({
      _id: folderId,
      user: req.user._id,
    });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await deleteFolderAndSubfolders(folderId, req.user._id);
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update the name of a folder
exports.updateFolderName = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;

    // Find and update the folder name
    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, user: req.user._id },
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json(folder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
