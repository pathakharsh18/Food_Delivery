const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const commentController = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Food routes
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);
router.post("/like", authMiddleware.authUserMiddleware, foodController.likeFood);
router.post("/save", authMiddleware.authUserMiddleware, foodController.saveFood);
router.get("/saved", authMiddleware.authUserMiddleware, foodController.getSavedVideos);

// Comment routes
router.post("/:foodId/comments", authMiddleware.authUserMiddleware, commentController.addComment);
router.get("/:foodId/comments", authMiddleware.authUserMiddleware, commentController.getComments);

module.exports = router;
