const { methods, permissions, roles } = require("../../utils/enums");
const { findUsers, createNewUser, getUserById,updateUserById, deleteUserById, changeRole } = require("./user_controller")

const userRoutePermission = {

   "/":{[methods.Get]:{permissions:[permissions.Find],mw:eval("findUsers"),roles:[roles.Admin]},
   // [methods.Get]:{permissions:[permissions.Find],mw:createNewUser},
    [methods.Post]:{permissions:[permissions.Create],mw:createNewUser},},

    "/:id":{[methods.Get]:{permissions:[permissions.FindOne],mw:getUserById,roles:[roles.User,roles.Admin]},
    [methods.Put]:{permissions:[permissions.Update],mw:updateUserById},
    [methods.Delete]:{permissions:[permissions.Delete],mw:deleteUserById}
},

    "/role/:id":{[methods.Put]:{permissions:[permissions.Update],mw:changeRole}},

}
//permission
const userRouteRoles = {
    [roles.Admin]:[permissions.Find,permissions.Create],
    [roles.Public]:[permissions.Find],
    [roles.User]:[permissions.Find,permissions.FindOne]
}
 
module.exports = {userRoutePermission,userRouteRoles}