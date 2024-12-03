"use strict";
const ApiKeyService = require("../services/apikey.service");

const HEADERS = {
    "API_KEY": 'x-api-key',
    "AUTHORIZATION": 'authorization'
}

class CheckAuth {
    static apiKey = async (req, res, next) => {
        try{
            const key = req.headers[HEADERS.API_KEY]?.toString()
            if(!key){
                return res.status(403).json({
                    message: "Invalid Api Key[1]"
                })
            }

            const existsKey = await ApiKeyService.findById(key)

            if(!existsKey){
                return res.status(403).json({
                    message: "Invalid Api Key [2]"
                })
            }

            req.objKey = existsKey

            return next()
        }catch (error) {

        }
    }

    static permission = (requiredPermission) => {
        return async (req, res, next) => {
            try {
                if (!req.objKey) {
                    return res.status(403).json({
                        message: "Permission denied", 
                    });
                }
    
                if (!req.objKey.permissions.includes(requiredPermission)) {
                    return res.status(403).json({
                        message: "Permission denied",
                    });
                }
    
                return next();
            } catch (error) {
                
            }
        };
    };
    
}

module.exports = CheckAuth