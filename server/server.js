const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectMongoDb = require("./connection");
const authRouter = require("./routes/auth/authRoute");
const adminProductRoutes = require("./routes/admin/productRoutes")

const app = express();
dotenv.config()
const PORT = process.env.PORT||5000;

//DATABASE CONNECTION
connectMongoDb(process.env.MONGO_URL).then(()=>{
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
}).catch((Error)=>{
    console.log("Error in connection",Error);
})

//Middlewares
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders:[
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/admin/products",adminProductRoutes)


app.listen(PORT,()=>console.log(`SERVER STARTED AT ${PORT} PORT`));