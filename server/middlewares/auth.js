const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/User')

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        //if token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            })
        }
        //verify token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            //by doing this we are adding decode to req now whenever there is any request we can fetch id,account type and email from req.user the data that we have sent in the payload
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}

//is student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for students only"
            })
        }
        next();
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        console.log(userDetails);

        console.log(userDetails.accountType);

        if (userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        console.log(req.user.accountType)
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for admin only"
            })
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}