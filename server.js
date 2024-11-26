const express = require("express")
const mongoose = require("mongoose")


const http = require("http")
const auth = require("./api/middlewares/auth")
const {loadRoutes,clearRoutes,watchFeatures} = require("./routes")

loadRoutes

const app = express()
const server = http.createServer(app)


app.use(express.json())
app.use(auth)

function startServer() {
    mongoose.connect(process.env.MONGO_URI, {}).then(async function () {


        watchFeatures(async () => {
            await clearRoutes(app)


            await loadRoutes(app)


        })
        await loadRoutes(app)

      
        // Start the server only after a successful connection
        server.listen(process.env.PORT, "0.0.0.0", function () {
            console.log("Server started")
        })
    }).catch(function (e) {
        console.log("Connection unsuccessful: " + e)
    })
}

module.exports = startServer