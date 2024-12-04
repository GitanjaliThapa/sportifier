require("dotenv").config()
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({host:"smtp.gmail.com",
    port:465,
    secure:true ,
    auth:{user:process.env.EMAIL,pass:process.env.PASSWORD}})


async function sendMail({to,subject,body}) {
   try {
    // console.log(transporter)
    const mailOptions = {from:process.env.EMAIL,to,subject,html:body}
    const email = await transporter.sendMail(mailOptions)
    if (!email)
        console.log(email)
   }
   catch (error){
    console.log(error)
   }
}

module.exports = {sendMail}