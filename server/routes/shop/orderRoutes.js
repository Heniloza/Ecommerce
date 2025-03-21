const express = require("express");

const router = express.Router();

const {
  createOrder,
  capturePayment,
} = require("../../controllers/shop/orderController.js");

router.post("/create", createOrder);

module.exports = router;
