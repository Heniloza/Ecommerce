const express = require("express");
const {
  getAllOrderUsers,
  getOrderDetailsAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/orderController");

const router = express.Router();

router.get("/get", getAllOrderUsers);
router.get("/details/:id", getOrderDetailsAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
