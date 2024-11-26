// const { userRoutePermission, userRouteRoles } = require("../users/user_route_permission")
//                       to access route,permission to eccess feature
function checkPermissions(roles,permissions,featurePermissions){
    return(req,res,next)=>{
        // console.log(featurePermissions)
        const role = req.user.role
        //fetch
        // const permission = userRouteRoles[role]
        //permission = per assigned to user & permissions = to acess route
        // console.log(permission,permissions)
// console.log(roles)
        // if (roles.length===0||roles.includes(role))//roles match check
        if (roles.includes(role))//roles match check

            return next()
const granted= permission(featurePermissions,role,permissions)
        if (granted){
            return next()
        }
        
           
        return res.status(403).json({message:"you don't have enough permission"})

    }
    console.log(req.user);
    console.log(req.method,req.baseUrl,req.path,req.params)
    next()



}

function permission(featurePermissions,role,permissions){
    let granted=false
    featurePermissions.forEach((e)=>{
        if(e.role===role)
        {
            if(permissions.some(item => e.permissions.includes(item))  )
                granted=true 
        }
    })
   // const granted = featurePermissions.some(data=>data.role === role && permissions.some(item => data.permissions.includes(item)))
console.log(granted)
   return granted
}

module.exports = checkPermissions