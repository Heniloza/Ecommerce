const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pinCode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

const ADDRESS = mongoose.model("address", addressSchema);

module.exports = ADDRESS;
