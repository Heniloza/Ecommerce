const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectMongoDb = require("./connection");
const authRouter = require("./routes/auth/authRoute");
const adminProductRoutes = require("./routes/admin/productRoutes");
const shopProductRoutes = require("./routes/shop/shopProductRoutes");
const shopCartRoutes = require("./routes/shop/ShopCartRoutes.js");
const addressRoutes = require("./routes/shop/addressRoutes.js");
const orderRoutes = require("./routes/shop/orderRoutes.js");
const adminOrderRoutes = require("./routes/admin/orderRoutes.js");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

//DATABASE CONNECTION
connectMongoDb(process.env.MONGO_URL)
  .then(() => {
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  })
  .catch((Error) => {
    console.log("Error in connection", Error);
  });

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/shop/products", shopProductRoutes);
app.use("/api/shop/cart", shopCartRoutes);
app.use("/api/shop/address", addressRoutes);
app.use("/api/shop/order", orderRoutes);
app.use("/api/admin/order", adminOrderRoutes);

app.listen(PORT, () => console.log(`SERVER STARTED AT ${PORT} PORT`));
