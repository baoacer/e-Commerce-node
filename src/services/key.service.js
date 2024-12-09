"use strict";
const keyModel = require("../models/key.model")
const {Types} = require("mongoose")

class KeyService{

    static createKey = async ({ shopId, publicKey, refreshToken }) => {
        try {
            const filter = {shop: shopId}
            // const update = {publicKey: publicKey, refreshTokensUsed: [], refreshToken: refreshToken}
            const update = {publicKey: publicKey, refreshToken: refreshToken}
            const options = {upsert: true, new: true} // neu ton tai thi update nguoc lai thi new

            const tokens = await keyModel.findOneAndUpdate(filter, update, options).lean()

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByShopId = async (shopId) => {
        return await keyModel.findOne({ shop: shopId }).lean()
    }

    // logout
    static removeByShopId = async ( shopId ) => {
        return await keyModel.deleteOne({ shop: shopId }).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    // handler refresh token
    static deleteKeyByShopId = async (shopId) => {
        return await keyModel.deleteOne({ shop: shopId }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyModel.findOne({ refreshToken: refreshToken })
    }

}

module.exports = KeyService