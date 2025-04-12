const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pinCode: String,
      phone: String,
      notes: String,
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: {
      type: String,
      required: function () {
        return this.paymentMethod === "paypal";
      },
    },
    payerId: {
      type: String,
      required: function () {
        return this.paymentMethod === "paypal";
      },
    },
  },
  { timestamps: true }
);

const ORDER = mongoose.model("order", orderSchema);

module.exports = ORDER;
