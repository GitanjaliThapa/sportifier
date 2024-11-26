const jwt = require("jsonwebtoken")
const { findUserById } = require("../users/user_service")
const { roles } = require("../../utils/enums")

async function auth(req,res,next){
    try{
    const token = req.headers["x-access-token"]
    eval("test()")
    test()
    if (!token)
       // return res.status(401).json({message:"token is required"})
         {
            req.user = {role:roles.Public}
            return next()
         }
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    if (decodedToken) { //token is verified
       const user = await findUserById(decodedToken.id) // 
      //  console.log (decodedToken,user)
    //    decodedToken.role = user.role
       req.user = decodedToken
       req.user.role = user.role

        return next()

    }
    else return res.status(401).json({message:"invalid token"})

}catch(error){
   if (error.message === "jwt expired")
    return res.status(406).json({message:"token expired"})
   return res.status(401).json({message:"error parsing token"})

}
}

function test(){
   //  console.log("test")
}


module.exports = (auth)