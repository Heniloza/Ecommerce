const PRODUCT = require("../../models/product.js");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword && typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and Must be String format",
      });
    }

    const regex = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
      ],
    };

    const searchResults = await PRODUCT.find(createSearchQuery);

    res.status(200).json({
      success: true,
      message: "Search result found",
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured in searching product",
    });
  }
};

module.exports = {
  searchProducts,
};
