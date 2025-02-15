const PRODDUCT = require("../../models/product");


const getFilteredeProdutcs = async(req,res)=>{
    try {
        const products = await PRODDUCT.find({});

        res.status(200).json({
            success:true,
            data:products
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some Error occured in Filtering products."
        })
    }
}

module.exports = {getFilteredeProdutcs};