const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerification");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        expires: 5 * 60,   // Expires in 5 minutes
    }
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "OTP verification email from StudyNotion",
            emailTemplate(otp)
        );
        console.log("Email sent successfully:", mailResponse);
    } catch (err) {
        console.error("Error occurred while sending email:", err);
        throw err;
    }
}

// Pre-save hook to send OTP email before saving to DB
OTPSchema.pre("save", function (next) {
    sendVerificationEmail(this.email, this.otp)
        .then(() => next()) 
        .catch((err) => {
            console.error("Email sending failed:", err);
            next();
        });
});

module.exports = mongoose.model("OTP", OTPSchema);
