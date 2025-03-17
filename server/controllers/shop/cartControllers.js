const mongoose = require("mongoose");
const CART = require("../../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if required fields are provided
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "User ID, Product ID, and Quantity are required",
      });
    }

    // Ensure `productId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    // Ensure `quantity` is a positive number
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    // Find the user's cart or create a new one
    let cart = await CART.findOne({ userId });

    if (!cart) {
      cart = new CART({ userId, items: [] });
    }

    // Check if product already exists in the cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      // Update quantity if product exists
      existingItem.quantity += quantity;
    } else {
      // Add new product
      cart.items.push({ productId, quantity });
    }

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding product to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch the cart for the user
    const cart = await CART.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // If no cart is found, return an empty cart response
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        data: { items: [] }, // Ensure frontend gets an empty cart
      });
    }

    // Ensure cart has items before filtering
    if (!cart.items || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        data: { ...cart._doc, items: [] },
      });
    }

    // Filter out invalid items (products that no longer exist)
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    // If some items are removed, update the cart
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Format the cart items for response
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      data: { ...cart._doc, items: populateCartItems },
    });
  } catch (error) {
    console.error("Fetch Cart Items Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching the cart",
    });
  }
};

const updateCartItemsQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate inputs
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. User ID, Product ID, and positive quantity are required.",
      });
    }

    // Find the user's cart
    let cart = await CART.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new CART({ userId, items: [] });
    }

    // Find the index of the product in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    // If product is not found, return error
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update quantity
    cart.items[findCurrentProductIndex].quantity = quantity;

    // Save updated cart
    await cart.save();

    // Populate cart items
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Update Cart Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating cart",
    });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cart = await CART.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "CART not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in deleting to cart",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemsQuantity,
  deleteCartItems,
};
