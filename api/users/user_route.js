const express = require("express")
const {userRoutePermission} = require("./user_route_permission")
const checkPermissions = require("../middlewares/permission")
const router = express.Router()


// router.get("/",findUsers)

// router.post("/",createNewUser)

// router.get("/:id", getUserById);      // Get a user by ID

// router.put("/:id", updateUserById);    // Update a user by ID

// router.delete("/:id", deleteUserById); // Delete a user by ID

// router.put("/role/:id",changeRole) //  change users role

// Object.values(userRoutePermission).forEach(route=>{
//     router[]
// })
console.log("entry")
Object.entries(userRoutePermission).forEach(([key,value])=> {
Object.entries(value).forEach(([method,detail])=>{
    router[method](key,checkPermissions(detail.roles,detail.permissions),detail.mw)
})

    // console.log (value)
    // router[key]()
})

module.exports = router
