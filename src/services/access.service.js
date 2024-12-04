const shopModel = require("../models/shop.model")
const bycrypt = require("bcrypt")
const crypto = require("crypto")
const keyService = require("./key.service")
const auth = require("../auth/auth.utils")
const Utils = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const ShopService = require("./shop.service")

const roleShop = {
    SHOP: "shop",
    ADMIN: "admin",
}

class AccessService{

    static logout = async ({  }) => {
        
    }

    /**
     * 1 - check email
     * 2 - check password
     * 3 - create PublicKey & PrivateKey 
     * 4 - generate tokens
     * 5 - return data
     */
    static login = async ({ email, password, refreshToken = null }) => {

        // 1 - Check Email
        const existsShop = await ShopService.findByEmail({email: email})
        if(!existsShop) throw new BadRequestError("Shop Not Register")

        // 2 - Check Password
        const match = await bycrypt.compare(password, existsShop.password)
        if(!match) throw new AuthFailureError("Incorrect Password Or Email")

        // 3 - Create PublicKey & PrivateKey & Save PublicKey
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
        
        // Generate AccessToken & RefreshToken
        const tokens = await auth.createTokenPair({
            payload: {
                shopId: existsShop._id,
                email: email
            },
            privateKey: privateKey
        })

          // Create & Save PublicKey To DB
        const publicKeyStr = await keyService.createKey({
            shopId: existsShop._id,
            publicKey: publicKey,
            refreshToken: tokens.refreshToken
        }) 

        if(!publicKeyStr){
            throw new BadRequestError("Error Generate Public Key")
         }

        // 5 - Return Data
        return {
            shop: Utils.getInfoData({
                field: ["_id", "name", "email"],
                object: existsShop
            }),
            tokens
        }
    }

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

            // create & save public key to database
            const publicKeyStr = await keyService.createKey({
                shopId: newShop._id,
                publicKey: publicKey,
            }) 

            const tokens = await auth.createTokenPair({
                payload: {
                    shopId: newShop._id,
                    email: email
                },
                privateKey: privateKey
            })

            if(!publicKeyStr){
               throw new BadRequestError("Error Generate Public Key")
            }

            return {
                shop: Utils.getInfoData({
                    field: ["_id", "name", "email"],
                    object: newShop
                }),
                tokens
            }
        }
        
        return null
    }

}

module.exports = AccessService