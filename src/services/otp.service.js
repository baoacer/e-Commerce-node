'use strict'

const crypto = require('crypto')
const OTP = require('../models/opt.model')
const { NotFoundError } = require('../core/error.response')
class OtpService{
    static async generatorTokenRandom(){
        return crypto.randomInt(0, Math.pow(2, 32))
    }

    static async newOtp({ email = null }){
        const token = await this.generatorTokenRandom()
        const newToken = await OTP.create({
            otp_token: token,
            otp_email: email,
        })
        return newToken
    }

    static async checkEmailToken({
        token
    }){
        const isToken = await OTP.findOne({
            otp_token: token
        }).lean()

        if(!isToken) throw new NotFoundError('Token not found')
        
        OTP.deleteOne({
            otp_token: token
        })

        return isToken
    }
}

module.exports = OtpService