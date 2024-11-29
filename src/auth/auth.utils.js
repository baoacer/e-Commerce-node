"use strict";
const jwt = require("jsonwebtoken")

class Auth{
    static createTokenPair = async ({ payload, publicKey, privateKey }) => {
        try{
            const accessToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "2d"
            })

            const refreshToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "7d"
            })

            // todo
            jwt.verify(accessToken, publicKey, (err, decoded) => {
                if(err){
                    console.log(`err::`, err)
                }else{
                    console.log(`decoded::`, decoded)
                }
            })

            return { accessToken, refreshToken }
        }catch (error) {
            console.log(error)
        }
    }
}

module.exports = Auth