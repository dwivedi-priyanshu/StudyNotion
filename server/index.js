const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payment");
const courseRoutes=require("./routes/Course");
const contactus=require("./routes/contactus")

const database=require('./config/database');
const cookieParser=require("cookie-parser");
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();
database.connect();
const PORT=process.env.PORT || 4000;
//database connect
database.connect();
//middilewares
app.use(express.json());
app.use(cookieParser())
app.use(
    cors(
        {origin:"*",credentials:true}
        
    )
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)
//cloudinary connection
cloudinaryConnect();
//routes mounting
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1",contactus)

app.listen(PORT,()=>{
    console.log("App is running at",PORT)
})