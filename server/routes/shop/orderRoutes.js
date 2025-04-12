const express = require("express");

const router = express.Router();

const {
  createOrder,
  capturePayment,
  getOrderDetails,
  getAllOrderByUser,
} = require("../../controllers/shop/orderController.js");

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrderByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
