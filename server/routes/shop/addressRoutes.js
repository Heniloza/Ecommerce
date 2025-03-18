const express = require("express");
const {
  addAddress,
  fetchAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/addressController");

const router = express.Router();

router.post("/add", addAddress);
router.get("/fetch/:userId", fetchAddress);
router.put("/update/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;
