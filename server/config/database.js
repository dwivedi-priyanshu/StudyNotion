const mongoose = require("mongoose");   // ⬅️ this line was missing
require("dotenv").config();

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Db connection established"))
  .catch((err) => {
    console.log("Db connection Failed");
    console.error(err);
    process.exit(1);
  });
};
