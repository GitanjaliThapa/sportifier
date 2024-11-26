const express = require("express")
const { featureRoutePermission} = require("./feature_route_permission")
const checkPermissions = require("../middlewares/permission")
const router = express.Router()



// Dynamically set up routes based on permissions
Object.entries(featureRoutePermission).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
        // console.log(details)
        router[method](path, checkPermissions(details.roles, details.permissions), details.mw)
    })
})

module.exports = router
