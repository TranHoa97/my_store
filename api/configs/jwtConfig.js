const jwt = require("jsonwebtoken")

const createJwt = (payload, key, time) => {
    try{
        let token = jwt.sign(payload, key, {expiresIn: time})
        return token
    }catch(err){
        console.log(err);
    }
}

const verifyJwt = (token, key) => {
    try{
        let decoded = jwt.verify(token, key)
        return decoded
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    createJwt,
    verifyJwt
}