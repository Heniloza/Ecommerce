const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

const FEATURE = mongoose.model("feature", featureSchema);

module.exports = FEATURE;
