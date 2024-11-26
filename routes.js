const express = require("express")
const feature = require("./api/feature/feature_controller")
const users = require("./api/users/user_controller")
const auth = require("./api/auth/auth_controller");
const checkPermissions = require("./api/middlewares/permission")
const { findFeatures,watchFeatures } = require("./api/feature/feature_service")

const mws = {
    feature, users, auth
}

async function loadRoutes(app) {
    
    // Retrieve and log features
    const Features = await findFeatures()
    Features.forEach(feature => {

        const router = express.Router()
        let routes = sortRoute(feature.routes)

        for (const route of routes) {
   
            router[route.method](route.path, checkPermissions(route.roles, route.permissions, feature.permissions), mws[feature.name][route.mw])
        }
   

        app.use("/" + feature.name, router)

    });
    app.use(require("./utils/errorHandler"))
}


async function clearRoutes(app) {
    app._router.stack = app._router.stack.filter(layer => layer.name !== "router" && layer.name !=="handleError")
    await new Promise(resolve => setTimeout(resolve, 100))

}


function sortRoute(routes) {
    routes.sort((a, b) => {
        const adynamic = a.path.includes(":")
        const bdynamic = b.path.includes(":")
        if (adynamic && !bdynamic) return 1
        if (!adynamic && bdynamic) return -1
        return a.path.localeCompare(b.path)


    })
    return routes
}

module.exports = {loadRoutes,clearRoutes,watchFeatures}

