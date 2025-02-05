const { imageUploadUtils } = require("../../helpers/cloudinary");
const PRODUCT = require("../../models/product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "Data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtils(url);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured in handling the image",
    });
  }
};
//Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const createdProduct = new PRODUCT({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await createdProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: createdProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured in adding a product",
    });
  }
};

//fetch all products
const fetchProduct = async (req, res) => {
  try {
    const listOfProducts = await PRODUCT.find();
    res.status(200).json({
      success: true,
      data: listOfProducts,
      message: "Data fetched.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured in fetching a product",
    });
  }
};

//Edit a product

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const findProduct = await PRODUCT.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not Found",
      });
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price || findProduct.price;
    findProduct.salePrice = salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
      message: "Product is edited",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured in editing a product",
    });
  }
};
//Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await PRODUCT.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not Found",
      });
    res.status(200).json({
      success: true,
      message: "Product is Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some Error Occured in deleting+ a product",
    });
  }
};
module.exports = {
  fetchProduct,
  editProduct,
  deleteProduct,
  addProduct,
  handleImageUpload,
};
