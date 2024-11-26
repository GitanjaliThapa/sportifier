const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const http = require("http")
const auth = require("./api/middlewares/auth")
const checkPermissions = require("./api/middlewares/permission")
const { findFeatures, watchFeatures } = require("./api/feature/feature_service")
const {   getFeatureById, updateFeatureById, deleteFeatureById, getFeatures, createNewFeature } = require("./api/feature/feature_controller")
const { findUsers, createNewUser, getUserById,updateUserById, deleteUserById, changeRole } = require("./api/users/user_controller")
const { logIn, signUp, forgotPassword, resetPassword } = require("./api/auth/auth_controller");





dotenv.config()
const app = express()
app.use(express.json())

app.use(auth)
// app.use(checkPermissions)
// app.use("/auth",require("./api/auth/auth_route"))

// app.use("/feature",require("./api/feature/feature_route"))


app.use(require("./utils/errorHandler"))
const server = http.createServer(app)

// mongoose.connect( process.env.MONGO_URI, {
// }).then(() => console.log("connection secured")).catch((e) => console.log(`connection unsucessful: ${e}`))


// server.listen(process.env.PORT,() => {
//     console.log("server Started")
// })



async function loadRoutes(){
    // Retrieve and log features
    const Features = await findFeatures() 
    Features.forEach(feature=> {
        // console.log(feature)
        const router = express.Router()
        let routes = sortRoute(feature.routes)
        // console.log(routes)
        for (const route of routes){ 
            // router[route.method](route.path,eval(route.mw))
// console.log(route)
            router[route.method](route.path,checkPermissions(route.roles,route.permissions,feature.permissions),eval(route.mw))
        }
        // feature.routes.every(route=>{//16
        //     router[route.method](route.path,checkPermissions(route.roles,route.permissions),eval(route.mw))

        // })
    app.use("/"+feature.name,router)

    });  
}

async function clearRoutes(){
    app._router.stack = app._router.stack.filter(layer=>!layer.route)
  
}
 function startServer() {
    mongoose.connect(process.env.MONGO_URI, {}).then(async function() {
        console.log("Connection secured")
     
        watchFeatures(async ()=>{
            await clearRoutes()

            await new Promise(resolve=> setTimeout(resolve,500))
            await loadRoutes()
           
        
        })
            await loadRoutes()

        // Start the server only after a successful connection
        server.listen(process.env.PORT, function() {
            console.log("Server started")
        })
    }).catch(function(e) {
        console.log("Connection unsuccessful: " + e)
    })
}

startServer()

function sortRoute(routes){
routes.sort((a,b)=>{
    const adynamic = a.path.includes(":")
    const bdynamic = b.path.includes(":")
    if(adynamic && !bdynamic) return 1
    if(!adynamic && bdynamic) return -1
    return a.path.localeCompare(b.path)


})
return routes 
}