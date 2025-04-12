const ORDER = require("../../models/order.js");

const getAllOrderUsers = async (req, res) => {
  try {
    const order = await ORDER.find({});

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

const getOrderDetailsAdmin = async (req, res) => {
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await ORDER.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found",
      });
    }

    await ORDER.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order Status is Updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Updating Order Status",
    });
  }
};

module.exports = {
  getAllOrderUsers,
  getOrderDetailsAdmin,
  updateOrderStatus,
};
