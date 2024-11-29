"use strict";
const jwt = require("jsonwebtoken")

class Auth{
    static createTokenPair = async ({ payload, privateKey }) => {
        try{
            const accessToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "2d"
            })

            const refreshToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "7d"
            })

            return { accessToken, refreshToken }
        }catch (error) {
            console.log(error)
        }
    }
}

module.exports = Auth