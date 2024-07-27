const express = require("express");
const {
  addImage,
  getUserImages,
  searchImages,
  uploadImage,
  getImagesByFolder,
  updateImageName,
  deleteImage,
} = require("../controllers/ImageController");
const { protect } = require("../middleware/AuthMiddleware");
const router = express.Router();

router
  .route("/")
  .post(protect, uploadImage, addImage)
  .get(protect, getUserImages);
router.route("/folder/:folderId/search").get(protect, searchImages);
router.get('/folder/:folderId', protect, getImagesByFolder);
router.put('/:imageId', protect, updateImageName);
router.delete('/:imageId', protect, deleteImage);

module.exports = router;
