const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const USER = require("../../models/User");

//Register
const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkUser = await USER.findOne({ email });
    if (checkUser)
      return res.json({
        success: true,
        message: "User already exists",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await USER({
      username,
      email,
      password: hashPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successsfully",
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//Login
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "")
      return res.json({
        success: false,
        message: "Please enter email",
      });
    const checkUser = await USER.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "Incorrect email",
      });
    if (password === "")
      return res.json({
        success: false,
        message: "Please Enter Password",
      });
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        username:checkUser.username
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, { httpOnly: true, secure: false })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          username: checkUser.username,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//Logout
const logoutController = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

//Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
   
    
    if (!token)
      res.json({
        success: false,
        message: "unauthorised user",
      });
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //     success:false,
    //     messsage:"Some Error occured"
    // })
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  authMiddleware,
};
