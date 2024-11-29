"use strict";
const keyModel = require("../models/key.model")

class KeyService{

    static createKey = async ({ shopId, publicKey }) => {
        try {
            const token = await keyModel.create({
                shop: shopId,
                publicKey: publicKey
            })

            return token ? publicKey : null
        } catch (error) {
            return error
        }
    }

}

module.exports = KeyService