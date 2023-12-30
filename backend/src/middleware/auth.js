import { verifyJwt } from "../config/jwtConfig"
require("dotenv").config()

export const checkUserJwt = (req, res, next) => {
    // console.log(req.cookies);
    let cookies = req.cookies
    if(cookies && cookies.jwt) {
        let token = cookies.jwt
        let decoded = verifyJwt(token, process.env.JWT_ACCESS_KEY)
        if(decoded){
            if (Date.now() >= decoded.exp * 1000) {
                return res.status(401).json({
                    st: 0, 
                    msg:"Not authenticated the user"
                })
            }
            req.user = decoded
            req.token = token
            next()
        }else{
            return res.status(401).json({
                st: 0, 
                msg: "Not authenticated the user"
            })
        }
    }else {
        return res.status(401).json({
            st: 0, 
            msg: "Not authenticated the user"
        })
    }
}

export const checkUserPermisson = (req, res, next) => {
    // console.log(req.baseUrl + req.path);
    if(req.user) {
        // Get roles, path
        let roles = req.user.groupWithRoles.roles.map(item => item.url)
        let currentUrl = req.baseUrl + req.path
        // Validation roles
        if(!roles || roles.length === 0) {
            return res.status(403).json({
                st: 0,
                msg: "You don't permission to access this resource..."
            })
        }
        // Check access url
        let canAccess = roles.some(item => item === currentUrl)
        if(canAccess === true) {
            next()
        }else {
            return res.status(403).json({
                st: 0,
                msg: "You don't permission to access this resource..."
            })
        }
    }else {
        return res.status(401).json({
            st: 0, 
            msg: "Not authenticated the user"
        })
    }
}
