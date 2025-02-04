const express = require("express")

const handleImageUpload= require("../../controllers/admin/productController")

const {upload} = require("../../helpers/cloudinary")

const router = express.Router();

router.post("/uploadImage",upload.single('my_file'),handleImageUpload);

module.exports = router;