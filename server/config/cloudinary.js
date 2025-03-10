const cloudinary = require("cloudinary").v2;

require("dotenv").config();
exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,  // Match `.env`
			api_secret: process.env.API_SECRET,  // Match `.env`
		});

	} catch (error) {
		console.log(error);
	}
};