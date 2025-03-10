const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const Profile = require('../models/Profile');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailSender=require("../utils/mailSender")
const { passwordUpdate } = require("../mail/templates/passwordUpdate")
require("dotenv").config();



//send otp
exports.sendOTP = async (req, res) => {
    try {
        //fetch email from request body
        const { email } = req.body;
        //check if user already exists
        const checkUserPresent = await User.findOne({ email })
        //if user is already present t
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }
        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("The generated otp:", otp);

        //check if the otp is unique or not,checking in db
        var result = await OTP.findOne({ otp });

        //untill we are getting an otp thats already present in the db we will keep generating the new otp
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp });
        }

        //create an entry for otp in db

        //writing the flow of execution
        //before saving the otp in db pre middileware defined in schema will run and will send the otp on mail ,user will receive the otp and after the otp is sent an entry of the otp will be created in the db ,ie next line will execute 
        const otpBody = await OTP.create({ email, otp })

        //return the response
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp
        })
    } catch (error) {
        console.log("Error in generating otp" + error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//sign up
exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        // Check if all required fields are present
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match. Please try again"
            });
        }

        // Check if the user already exists 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue"
            });
        }

        // Fetch the most recent OTP for the email
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).exec();

       
        if (String(otp) !== String(recentOtp.otp)) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Hash the password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile object
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id, 
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        });

    } catch (error) {
        console.log("SignUp Error:", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered",
            error: error.message // Send error message for debugging
        });
    }
};


//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation of data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        //check if the user already exist
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registerd"
            })
        }
        //match the password
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email:user.email,
                id: user._id,
                accountType: user.accountType,
            }
            //third parameter is for options,this token will expire in 2h
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            //user.password =undefined because we are returning the user and we dont want to show the password of the user
            user.password = undefined;
            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),//for 3 days
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure,please try again",
            error:error.message
        })
    }
}

//change password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdate(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
         console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        // console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      // console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
}