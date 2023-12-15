import jwt from "jsonwebtoken"

export const createJwt = (payload, key, time) => {
    try{
        let token = jwt.sign(payload, key, {expiresIn: time})
        return token
    }catch(err){
        console.log(err);
    }
}

export const verifyJwt = (token, key) => {
    try{
        let decoded = jwt.verify(token, key)
        return decoded
    }catch(err){
        console.log(err);
    }
}
