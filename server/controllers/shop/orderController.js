const ORDER = require("../../models/order.js");
const paypal = require("../../helpers/paypal.js");
const CART = require("../../models/cart.js");

//Creating order
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
      paymentId,
      payerId,
    } = req.body;

    const createPaymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypalReturn",
        cancel_url: "http://localhost:5173/shop/paypalCancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Description of paypal payment method",
        },
      ],
    };

    paypal.payment.create(createPaymentJson, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          messagge: "Error in creating payment",
        });
      } else {
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
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalUrl = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalUrl,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      messagge: "Error in Creating order",
    });
  }
};

//To capture the payment
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await ORDER.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        messagge: "Order not founded",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    const getCartId = order.cartId;
    await CART.findByIdAndDelete(getCartId);
    await order.save();

    res.status(200).json({
      success: true,
      messagge: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      messagge: "Error in Creating order",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
};
