const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  video: String,
  foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
});

module.exports = mongoose.model("Food", foodSchema);
