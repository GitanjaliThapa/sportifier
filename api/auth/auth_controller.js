const { sendMail } = require("../../utils/email");
const {loginUser,signUpUser,forgotPasswordbyUser,resetPasswordbyUser, generateAndSaveVerificationCode} = require("./auth_service")


async function logIn(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await loginUser({ email, password })
    res.status(200).json(user)
} catch (error) {
    next(error)
}
    
}

async function signUp(req, res, next) {
    
    try {
        const response = await signUpUser(req.body)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}



// async function forgotPassword(req, res, next) {
//     try {
//         const { email } = req.body

//         // Call the forgotPasswordbyUser to find the user
//         const user = await forgotPasswordbyUser(email)
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         // Call the service function to generate and save the verification code
//         const {code,expiresAt} = await generateAndSaveVerificationCode(user)

//         // Optionally, log the code or respond
//         console.log(`Generated verification code: ${code}`)
//         sendMail({to:email,subject:"password Reset Code",body:"Your Code to reset password is " + code})

//         return res.status(200).json({code,message: `Your verification code will expire in 5 minutes.`,
//             expiresAt });

//     } catch (error) {
//         console.error("Error in forgotPassword:", error)
//         return res.status(500).json({ message: "Internal server error", error: error.message })
//     }
// }

async function forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
  
      // Validate the email input
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Call the service function to find the user by email
      const user = await forgotPasswordbyUser(email);
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Call the service function to generate and save the verification code
      const { code, expiresAt } = await generateAndSaveVerificationCode(user);
  
      // Log the code for debugging
      console.log(`Generated verification code: ${code}`);
  
      // Construct the HTML email body
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1ba933 ;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              font-size: 30px;
              font-weight: bold;
              text-align: center;
              color: #4CAF50;
              margin-bottom: 20px;
            }
            .content {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .code {
              display: inline-block;
              background-color: #f2f2f2;
              padding: 10px 20px;
              font-size: 18px;
              font-weight: bold;
              border-radius: 5px;
              color: #333;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Password Reset Code</div>
            <div class="content">
              Hello,<br><br>
              Your code to reset your password is:
              <div class="code">${code}</div>
              <br>
              This code will expire in <strong>5 minutes</strong>.
            </div>
        
          </div>
        </body>
        </html>
      `
  
      // Send the email
      await sendMail({
        to: email,
        subject: "Password Reset Code",
        body: htmlBody,
        isHtml: true, // Ensure the email library supports HTML content
      });
  
      // Return success response
      return res.status(200).json({
        code,
        message: "Verification email sent successfully.",
        expiresAt,
      });
  
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return res.status(500).json({
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
  


async function resetPassword(req, res, next) {
    try {
        const { code,password,oldPassword } = req.body
        const {user} = req
        const response = await resetPasswordbyUser({code,password,user,oldPassword})
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    logIn:logIn,
    signUp:signUp,
    forgotPassword:forgotPassword,
    resetPassword:resetPassword
}