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



async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body

        // Call the forgotPasswordbyUser to find the user
        const user = await forgotPasswordbyUser(email)
        
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Call the service function to generate and save the verification code
        const {code,expiresAt} = await generateAndSaveVerificationCode(user)

        // Optionally, log the code or respond
        console.log(`Generated verification code: ${code}`)

        return res.status(200).json({code,message: `Your verification code will expire in 5 minutes.`,
            expiresAt });

    } catch (error) {
        console.error("Error in forgotPassword:", error)
        return res.status(500).json({ message: "Internal server error", error: error.message })
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