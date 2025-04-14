const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    username: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

const REVIEW = mongoose.model("review", reviewSchema);

module.exports = REVIEW;
