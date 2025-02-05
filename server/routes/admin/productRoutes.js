const express = require("express")

const {handleImageUpload, addProduct, fetchProduct, editProduct, deleteProduct}= require("../../controllers/admin/productController")

const {upload} = require("../../helpers/cloudinary")

const router = express.Router();

router.post("/uploadImage",upload.single('my_file'),handleImageUpload);
router.post("/add",addProduct);
router.get("/fetchProduct",fetchProduct)
router.put("/edit/:id",editProduct)
router.delete("/delete/:id",deleteProduct)

module.exports = router;