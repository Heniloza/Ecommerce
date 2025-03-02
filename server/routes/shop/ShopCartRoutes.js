const express = require("express");

const router = express.Router();

const {
  addToCart,
  fetchCartItems,
  updateCartItemsQuantity,
  deleteCartItems,
} = require("../../controllers/shop/cartControllers");

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update", updateCartItemsQuantity);
router.delete("/delete/:userId/:productId", deleteCartItems);

module.exports = router;
