const express = require("express");
const { registerController, loginController,authMiddleware,logoutController} = require("../../controllers/auth/authController");
const router = express.Router();

router.post("/register",registerController);
router.post('/login',loginController);
router.post("/logout",logoutController)
router.get("/checkauth",authMiddleware,(req,res)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        message:"Use is authenticated.",
        user,
    })
})

module.exports = router;