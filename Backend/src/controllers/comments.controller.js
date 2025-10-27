const Food = require("../models/food.model");
const User = require("../models/user.model");

//  Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const foodId = req.params.foodId;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    //  Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Find food by ID
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    //  Fetch the user’s name (fix applied here)
    const user = await User.findById(req.user._id).select("username name fullName");
    const username = user?.username || user?.name || user?.fullName || "Anonymous";

    //  Create new comment
    const newComment = {
      user: req.user._id,
      username, // Now will show actual logged-in user's name
      text: text.trim(),
      createdAt: new Date(),
    };

    //  Push to food.comments array
    food.comments.unshift(newComment);
    await food.save();

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error(" Error in addComment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Get comments
exports.getComments = async (req, res) => {
  try {
    const foodId = req.params.foodId;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(food.comments || []);
  } catch (err) {
    console.error(" Error in getComments:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
