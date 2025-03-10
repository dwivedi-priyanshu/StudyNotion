const mongoose=require('mongoose');
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log("Db connection established"))
    .catch((err)=>{
        console.log("Db connection Failed");
        console.error(err);
        process.exit(1);
    })
}

