const ORDER = require("../../models/order.js");
const CART = require("../../models/cart.js");
const paypal = require("@paypal/checkout-server-sdk");
require("dotenv").config();

// Configure PayPal Environment
function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_SECRET_ID;
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// Create Order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    // Create PayPal Order Items
    const items = cartItems.map((item) => ({
      name: item.title,
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2),
      },
      quantity: item.quantity.toString(),
    }));

    // Create PayPal Order Request
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: items,
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shop/paypalReturn",
        cancel_url: "http://localhost:5173/shop/paypalCancel",
        user_action: "PAY_NOW",
      },
    });

    const response = await client().execute(request);
    console.log("PayPal Order Response:", response.result);

    const approvalLink = response.result.links?.find(
      (link) => link.rel === "approve"
    )?.href;
    console.log("Redirect user to:", approvalLink);

    if (!approvalLink) {
      throw new Error("Approval URL not found");
    }

    const newlyCreatedOrder = new ORDER({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: response.result.id,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      approvalUrl: approvalLink,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error in Creating Order",
    });
  }
};

// Capture Payment
const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await ORDER.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.paymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing paymentId for this order",
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(order.paymentId);
    request.requestBody({});

    const capture = await client().execute(request);
    console.log("Payment Capture Response:", capture.result);

    if (capture.result.status !== "COMPLETED") {
      throw new Error("Payment not completed");
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = capture.result.payer.payer_id;

    await CART.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error in Capturing Payment",
    });
  }
};

const getAllOrderByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const order = await ORDER.find({ userId });

    if (!order.length) {
      res.status(404).json({
        success: false,
        message: "No Order found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in getting all orders",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await ORDER.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in getting all orders",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrderByUser,
  getOrderDetails,
};
