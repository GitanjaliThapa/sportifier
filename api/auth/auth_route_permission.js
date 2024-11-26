const { methods, permissions } = require("../../utils/enums");
const { logIn, signUp, forgotPassword, resetPassword } = require("./auth_controller");

const authRoutePermission = {

    "/login":{[methods.Post]:{permissions:[permissions.Create],mw:logIn}},

    "/signup":{[methods.Post]:{permissions:[permissions.Create],mw:signUp}},

    "/forgot-password":{[methods.Post]:{permissions:[permissions.Create],mw:forgotPassword}},

    "/reset-password":{[methods.Post]:{permissions:[permissions.Create],mw:resetPassword}},

    "/reset-password/me":{[methods.Post]:{permissions:[permissions.Create],mw:resetPassword}},


}

module.exports = {authRoutePermission}


