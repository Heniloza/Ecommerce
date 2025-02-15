const express = require("express")

const {getFilteredeProdutcs}= require("../../controllers/shop/shopProductsController")


const router = express.Router();


router.get("/fetchProduct",getFilteredeProdutcs)


module.exports = router;