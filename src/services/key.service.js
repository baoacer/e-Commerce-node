"use strict";
const keyModel = require("../models/key.model")

class KeyService{

    static createKey = async ({ shopId, publicKey }) => {
        try {
            const publicKeyStr = publicKey.toString()
            const token = await keyModel.create({
                shop: shopId,
                publicKey: publicKeyStr
            })

            return token ? publicKeyStr : null
        } catch (error) {
            return error
        }
    }

}

module.exports = KeyService