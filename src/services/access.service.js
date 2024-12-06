const shopModel = require("../models/shop.model")
const bycrypt = require("bcrypt")
const crypto = require("crypto")
const KeyService = require("./key.service")
const AuthUtils = require("../auth/auth.utils")
const Utils = require("../utils")
const { BadRequestError, AuthFailureError, FobiddenError } = require("../core/error.response")
const ShopService = require("./shop.service")

const roleShop = {
    SHOP: "shop",
    ADMIN: "admin",
}

class AccessService{

    /*
        1 - Check refreshTokenUsed
        2 - Check refreshToken
        3 - Generate New Key
    */
    static handlerRefreshToken = async ({ refreshToken, key }) => {
        /* 1 - Check refreshTokenUsed */
        if( key.refreshTokensUsed.includes(refreshToken) ){
            await KeyService.deleteKeyByShopId( key.shop )
            throw new FobiddenError("Something Wrong Happed ! Please Relogin")
        } 

        if( key.refreshToken !== refreshToken ){
            throw new AuthFailureError("Shop Not Register")
        }

        /* 2 - Check refreshToken */
        const existsToken = await KeyService.findByRefreshToken( refreshToken )
        if(!existsToken) throw new AuthFailureError("Shop Not Register")

        const { shopId, email } = await AuthUtils.verifyJWT({
                token: refreshToken,
                publicKey: existsToken.publicKey 
            })

        const existsShop = await ShopService.findByEmail({email: email})
        if(!existsShop) throw new AuthFailureError("Shop Not Register")

        /* 3 - Generate New Key */
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
        
        const tokens = await AuthUtils.createTokenPair({
            payload: {
                shopId: existsShop._id,
                email: email
            },
            privateKey: privateKey
        })

        const publicKeyDbs = await KeyService.createKey({
            shopId: existsShop._id,
            publicKey: publicKey,
            refreshToken: tokens.refreshToken
        }) 

        if(!publicKeyDbs){
            throw new BadRequestError("Error Generate Public Key")
        }

        await existsToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // luu refreshToken da duoc su dung
            }
        })

        return {
            shop: Utils.getInfoData({
                field: ["_id", "name", "email"],
                object: existsShop
            }),
            tokens
        }
    }

    static logout = async ({ key }) => {
        return await KeyService.removeByShopId(key.shop)
    }

    /**
     * 1 - check email
     * 2 - check password
     * 3 - Create PublicKey & PrivateKey & Save PublicKeyeKey 
     * 4 - Generate AccessToken & RefreshToken
     * 5 - return data
     */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1
        const existsShop = await ShopService.findByEmail({email: email})
        if(!existsShop) throw new BadRequestError("Shop Not Register")

        // 2 
        const match = await bycrypt.compare(password, existsShop.password)
        if(!match) throw new AuthFailureError("Incorrect Password Or Email")

        // 3 
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

        // 4 
        const tokens = await AuthUtils.createTokenPair({
            payload: {
                shopId: existsShop._id,
                email: email
            },
            publicKey: publicKey,
            privateKey: privateKey
        })

          // Create & Save PublicKey To DB
        const publicKeyDbs = await KeyService.createKey({
            shopId: existsShop._id,
            publicKey: publicKey,
            refreshToken: tokens.refreshToken
        }) 

        if(!publicKeyDbs){
            throw new BadRequestError("Error Generate Public Key")
         }

        // 5
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
            const publicKeyDbs = await KeyService.createKey({
                shopId: newShop._id,
                publicKey: publicKey,
            }) 

            const tokens = await AuthUtils.createTokenPair({
                payload: {
                    shopId: newShop._id,
                    email: email
                },
                privateKey: privateKey
            })

            if(!publicKeyDbs){
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