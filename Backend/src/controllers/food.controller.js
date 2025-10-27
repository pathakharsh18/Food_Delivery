const foodModel = require("../models/food.model");
const storageService = require("../services/storage.services");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const userModel = require("../models/user.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    const fileName = uuid() + ".mp4";
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, fileName);

    console.log("Uploaded File URL:", fileUploadResult.url);

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

      return res.status(200).json({ message: "Food unliked successfully" });
    }

    const like = await likeModel.create({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Food liked successfully", like });
  } catch (error) {
    console.error("Error liking food:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: user._id, food: foodId });
      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    const save = await saveModel.create({
      user: user._id,
      food: foodId,
    });

    res.status(201).json({ message: "Food saved successfully", save });
  } catch (error) {
    console.error("Error saving food:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function getSavedVideos(req, res) {
  try {
    const user = req.user;

    const savedItems = await saveModel.find({ user: user._id }).populate("food");
    const videos = savedItems.map((item) => item.food);

    res.status(200).json({
      message: "Saved videos fetched successfully",
      savedItems: videos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


async function addComment(req, res) {
  try {
    const { foodId } = req.params;
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ message: "Text and userId required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const newComment = {
      user: user._id,
      username: user.username, 
      text,
    };

    food.comments.push(newComment);
    await food.save();

    res.status(200).json({ message: "Comment added successfully", comments: food.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedVideos,
  addComment, 
};
