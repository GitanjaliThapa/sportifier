const user_service = require("../users/user_service");
const bcrypt = require("bcrypt");
const User = require("../users/user_model"); // Assuming you have a User model defined here
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const { roles } = require("../../utils/enums");


async function generateToken(user){
    const payload = {id:user._id,email:user.email,role:user.role}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"24h"})
    return token
}



async function loginUser({ email, password }) {
    try {
        // Fetch the user with just the email (password shouldn't be part of the query)
        const user = await user_service.findOne({ email })
        return await comparePwd(user,password)        // If user exists, compare the password


        
    } catch (error) {
        return { message: error.message }
    }
}

async function comparePwd(user,password){

    if (user && await bcrypt.compare(password, user.password)) {
        const token = await generateToken(user)
        return {...user._doc,token}
    } else {
        throw new Error('Invalid credentials')
    }
}


async function signUpUser(data) {
    try {
        const {email,password,name,phone,gender,} = data  
        const existingUser = await user_service.findOne({ email })
        // console.log(existingUser)
        if (existingUser) {
            const error = new Error("User already exists")
            error.code = 11000
            error.keyValue = {email}
            throw error
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Create a new user
        const newUser = new User({ email, password: hashedPassword, phone, gender, name })
        await newUser.save()

        return newUser
    } catch (error) {
        // throw new Error(error.message);
        throw error
    }
}



async function forgotPasswordbyUser(email) {
    try {
       
        // Find user in the database by email
        const user = await user_service.findOne({ email })
        return user
       
        
    } catch (error) {
        throw error
    }
}


const generateAndSaveVerificationCode = async (user) => {
    
    try {
       
        let code//null
        if (user.pwdInfo) { // Checking if forgot password has been initiated
            if (user.pwdInfo.codeExpiry < Date.now()) { // Code is already expired
                code = generateVerificationCode()
            } else {
                return {
                    code: user.pwdInfo.code,
                    expiresAt: new Date(user.pwdInfo.codeExpiry)
                }
            }
        } else {
            code = generateVerificationCode()
        }

        const codeExpiry = Date.now() + 600000 // Expiry time set to 10 minutes (600,000 ms)
        const pwdInfo = { code, codeExpiry }
        user["pwdInfo"] = pwdInfo;
        await user.save()
              
              return {
                code,
                expiresAt: new Date(codeExpiry) // Return the expiration time in a readable format
            };
        } catch (error) {
            throw new Error('Error saving verification code: ' + error.message)
        }
}

   
        // Return the code for further processing if needed
    const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000)
}



async function resetPasswordbyUser({code,password,user,oldPassword}) {
    try {
        let foundUser
        if (user && user.role != roles.Public){
        foundUser = await user_service.findUserById(user.id)
        if (!await comparePwd(foundUser,oldPassword))
            await generateAndSaveVerificationCode(foundUser)

        throw new Error("password doesn't match")
        //payload came from token

        }else{
        foundUser = await user_service.findOne({ "pwdInfo.code":code })
        if (!foundUser) throw new Error('User not found');
        }

        const hashedPassword = await bcrypt.hash(password,10)// // Hash the new password before storing it
        foundUser.password = hashedPassword // Update the user's password with the new hashed password

        foundUser.pwdInfo = undefined
        await foundUser.save()

        return { message: 'Password reset successful' }

    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {loginUser,signUpUser,forgotPasswordbyUser,resetPasswordbyUser,generateAndSaveVerificationCode}

