const ADDRESS = require("../../models/address");

//ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pinCode, phone, notes } = req.body;

    if (!userId || !address || !city || !pinCode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Not all data provided",
      });
    }

    const newlyCretedAddress = new ADDRESS({
      userId,
      address,
      city,
      pinCode,
      phone,
      notes,
    });

    await newlyCretedAddress.save();

    res.status(201).json({
      success: true,
      message: "New address created successfully",
      data: newlyCretedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding address",
    });
  }
};

//FETCH ADDRESS
const fetchAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Uerid is required",
      });
    }

    const addressList = await ADDRESS.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding address",
    });
  }
};

//EDIT ADDRESS
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Not all data provided",
      });
    }

    const formData = req.body;

    const updatedAddress = await ADDRESS.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding address",
    });
  }
};

//DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Not all data provided",
      });
    }

    const deletedAddress = await ADDRESS.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding address",
    });
  }
};

module.exports = {
  addAddress,
  fetchAddress,
  editAddress,
  deleteAddress,
};
