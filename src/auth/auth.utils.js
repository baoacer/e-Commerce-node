"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyService = require("../services/key.service");

const HEADERS = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

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

    /*
        1 - Check shopId in header
        2 - Check key by shopId
        3 - Check accessToken in header
        4 - Verify accessToken
        5 - Return next 
    */
    static authentication = asyncHandler(async (req, res, next) => {
        // 1 - Check shopId in header
        const shopId = req.headers[HEADERS.CLIENT_ID]
        if(!shopId) throw new AuthFailureError("Invalid Request")

        //  2 - Check key by shopId
        const key = await KeyService.findByShopId(shopId)
        if(!key) throw new NotFoundError("Not Found Key")
           
        //  3 - Check accessToken in header
        const accessToken = req.headers[HEADERS.AUTHORIZATION]
        if(!accessToken) throw new AuthFailureError("Invalid Request")

        // 4 - Verify accessToken
        try {
            const decode = jwt.verify(accessToken, key.publicKey)
            if(shopId !== decode.shopId) throw new AuthFailureError("Invalid ShopId")     
            
            req.key = key

            // 5 - Return next
            return next()
        } catch (error) {
            throw error
        }

    })
}

module.exports = Auth