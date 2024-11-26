const mongoose = require("mongoose")
const { roles, genders } = require("../../utils/enums")
const pwdInfo = mongoose.Schema({
     // Add the verification code and timestamp fields
     code: { type: String }, // String to store the code
     codeExpiry: { type: Date }, // Date to store when the code was generated
 
})

const UserSchema = mongoose.Schema({
    name:{type:String,required: true,unique: true},
    password:{type:String,required: true,minlength:6},
    email:{type:String,required: true,
        unique: true,},
    phone:{type:String,required: true,unique: true,minlength:10,maxlength:10},
    gender:{type:String,required: true,enum:Object.values(genders)},
    pwdInfo:pwdInfo,

   
    // role:{type:String,enum:["user","admin"],default:"user"},
    role:{type:String,enum:Object.values(roles),default:roles.User}
},{timestamps:true})//created time

const User = mongoose.model("User",UserSchema)
module.exports = User