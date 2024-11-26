const express = require("express")
const auth = require("../middlewares/auth")
const { authRoutePermission } = require("./auth_route_permission")
const router = express.Router()


// router.post("/login", logIn)

// router.post("/signup", signUp)

// router.post("/forgot-password", forgotPassword)

// router.post("/reset-password", resetPassword)//without token

// router.post("/reset-password/me",auth, resetPassword)

Object.entries(authRoutePermission).forEach(([key,value])=> {
    Object.entries(value).forEach(([method,detail])=>{
        router[method](key,detail.mw)
    })
})

module.exports = router