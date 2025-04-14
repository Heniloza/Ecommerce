const ORDER = require("../../models/order");
const PRODUCT = require("../../models/product");
const REVIEW = require("../../models/review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, username, reviewMessage, reviewValue } =
      req.body;

    const order = await ORDER.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExsistingReview = await REVIEW.findOne({ productId, userId });

    if (checkExsistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product ",
      });
    }

    const newReview = new REVIEW({
      productId,
      userId,
      username,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await REVIEW.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await PRODUCT.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in adding the review ",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await REVIEW.findById(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in adding the review ",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
};
