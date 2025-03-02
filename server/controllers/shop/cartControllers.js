const CART = require("../../models/cart");
const PRODUCT = require("../../models/product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const product = await PRODUCT.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    let cart = await CART.findOne({ userId });

    if (!cart) {
      cart = new CART({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push(productId, quantity);
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in adding to cart",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const cart = await CART.findOne({ userId }).populate({
      path: "item.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
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
      message: "Error occured in fetching to cart",
    });
  }
};

const updateCartItemsQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!cart) {
      cart = new CART({ userId, items: [] });
    }

    const cart = await CART.findOne({ userId });

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex !== -1) {
      return res.status(404).json({
        success: false,
        message: "Cart items not found",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;

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
      message: "Error occured in updating to cart",
    });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.body;
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
      res.status(404).json({
        success: false,
        message: "CART not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    await CART.populate({
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
