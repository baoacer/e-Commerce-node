"use strict";
const keyModel = require("../models/key.model")
const {Types} = require("mongoose")

class KeyService{

    static createKey = async ({ shopId, publicKey, refreshToken }) => {
        try {
            const filter = {shop: shopId}
            const update = {publicKey: publicKey, refreshTokensUsed: [], refreshToken: refreshToken}
            const options = {upsert: true, new: true} // neu ton tai thi update nguoc lai thi new

            const tokens = await keyModel.findOneAndUpdate(filter, update, options).lean()

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByShopId = async (shopId) => {
        return await keyModel.findOne({ shop: Types.ObjectId.createFromHexString(shopId) }).lean()
    }

    static removeByShopId = async ( shopId ) => {
        return await keyModel.deleteOne({ shop: shopId }).lean()
    }

}

module.exports = KeyService