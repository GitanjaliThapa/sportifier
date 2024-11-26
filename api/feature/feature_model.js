const mongoose = require("mongoose")
const { permissions, methods, roles } = require("../../utils/enums")

const permissionsSchema = new mongoose.Schema({
    role: { type: String, enum: Object.values(roles), default: roles.User },
    permissions: [{ type: String, enum: Object.values(permissions) }]
})

const RouteSchema = new mongoose.Schema({
    path: { type: String, required: true },
    method: { type: String, required: true, enum: Object.values(methods) },
    permissions: [{ type: String, enum: Object.values(permissions) }],
    mw: { type: String, required: true }, // Storing middleware as a string to eval later
    roles: [{ type: String, enum: Object.values(roles), default: roles.User }]
}, { timestamps: true })

const FeatureSchema = mongoose.Schema({
    name:{type:String,required: true,unique: true},
    routes:[RouteSchema],
    permissions: [permissionsSchema]
    
},{timestamps:true})


// Create the Route model
const Feature = mongoose.model("Feature", FeatureSchema)

// Export the Route model
module.exports = Feature