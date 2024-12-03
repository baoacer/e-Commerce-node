const shopModel = require("../models/shop.model")
const bycrypt = require("bcrypt")
const crypto = require("crypto")
const keyService = require("./key.service")
const auth = require("../auth/auth.utils")
const Utils = require("../utils")
const { BadRequestError } = require("../core/error.response")

const roleShop = {
    SHOP: "shop",
    ADMIN: "admin",
}

class AccessService{

    static signUp = async ({name, email, password}) => {
        const existsShop = await shopModel.findOne({
            email: email},
            "email"
        ).lean()

        if(existsShop){
            throw new BadRequestError("Email already exists")
        }

        const passwordHash = await bycrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name: name,
            email: email,
            password: passwordHash,
            roles: [roleShop.SHOP],
        })

        if(newShop){
            const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: "pkcs1",
                    format: "pem"
                },
                privateKeyEncoding: {
                    type: "pkcs1",
                    format: "pem"
                }
            })
            console.log(privateKey, publicKey)

            // create & save public key to database
            const publicKeyStr = await keyService.createKey({
                shopId: newShop._id,
                publicKey
            }) 

            if(!publicKeyStr){
               throw new BadRequestError("Create public key error")
            }

            const tokens = await auth.createTokenPair({
                payload: {
                    shopId: newShop._id,
                    email: email
                },
                privateKey: privateKey
            })

            return {
                code: 200,
                metadata: {
                    shop: Utils.getInfoData({
                        field: ["_id", "name", "email"],
                        object: newShop
                    }),
                    tokens
                }
            }

        }
        
        return {
            code: 200,
            metadata: null
        }
    }

}

module.exports = AccessService