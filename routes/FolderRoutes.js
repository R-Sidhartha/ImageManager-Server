const express = require("express");
const {
  createFolder,
  getUserFolders,
  updateFolderName,
  deleteFolder,
} = require("../controllers/FolderController");
const { protect } = require("../middleware/AuthMiddleware");
const router = express.Router();

router.route("/").post(protect, createFolder).get(protect, getUserFolders);
router.patch('/:folderId', protect, updateFolderName);
router.delete('/:folderId', protect, deleteFolder);
module.exports = router;
