"use strict";
const keyModel = require("../models/key.model")

class KeyService{

    static createKey = async ({ userId, publicKey, refreshToken }) => {
        try {
            const filter = { user: userId }
            const update = {publicKey: publicKey, refreshToken: refreshToken}
            const options = {upsert: true, new: true} 
            const tokens = await keyModel.findOneAndUpdate(filter, update, options).lean()

            console.log(tokens)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyModel.findOne({ user: userId }).lean()
    }

    // logout
    static removeByShopId = async ( userId ) => {
        return await keyModel.deleteOne({ user: userId }).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    // handler refresh token
    static deleteKeyByShopId = async (userId) => {
        return await keyModel.deleteOne({ user: userId }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyModel.findOne({ refreshToken: refreshToken })
    }

}

module.exports = KeyService