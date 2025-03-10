
const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    if (!email) {
      throw new Error("Recipient email is not defined or empty");
    }
    console.log("Recipient Email:", email); // Log the email address
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"Studynotion " <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender
