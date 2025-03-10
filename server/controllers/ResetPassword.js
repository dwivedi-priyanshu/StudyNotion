const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get mail from req body 
        const { email } = req.body;
        //checkk user exist for this email
        const user = await User.find({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your email is not registered"
            })
        }
        // generate token 
        const token = crypto.randomBytes(20).toString("hex")
        //updating user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
              token: token,
              resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true }
          )

        //create url
        const url = `http://localhost:3000/update-password/${token}`;
        //send mail containing url
        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
          )
             
        return res.json({
            success: true,
            message: "Email sent successfully.Please check email and change Password"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while changing password"
        })
    }

}

//resetPAssword
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not match Confirm Password"
            })
        }
        //getuser details from db using token--->isiliye humne token ko user schema mai add kiya tha sirf isi step ke liye kyunki is step mai hum koi to parameter chahiye na taki user ki details db se fetch kar paye par hum to sirf password bhej rahe to db mai kaise update karenge,kaise db  ki entry fetch karenge
        const userDetails = await User.findOne({ token });

        //if no entry -invalid token 
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is invalid'
            })
        }
        //token time check
        //**********Dont change this if part its wrong in original code******** */
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired ,please regenerate your token"
            })
        }
        //hash paswd
        const hashedPassword = await bcrypt.hash(password, 10);
        //upate password
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword }
        )

        return res.status(200).json({
            success: true,
            message: "Password reset successfull"
        })
    }
    catch (error) {
        res.json({
            success:false,
            message:"Password cannot be reseted"
        })
    }
}