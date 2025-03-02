const express = require("express");

const {
  getFilteredeProdutcs,
  getProductDetails,
} = require("../../controllers/shop/shopProductsController");

const router = express.Router();

router.get("/fetchProduct", getFilteredeProdutcs);
router.get("/get/:id", getProductDetails);

module.exports = router;
