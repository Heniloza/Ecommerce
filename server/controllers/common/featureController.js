const FEATURE = require("../../models/feature.js");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImages = new FEATURE({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      message: "Feature image addded successfully",
      data: featureImages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding feature image ",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await FEATURE.find({});

    if (!images) {
      return res.status(404).json({
        success: false,
        messaage: "Not images found",
      });
    }
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding feature image ",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };
