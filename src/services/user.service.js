'use strict'

const { BadRequestError, ConflictRequestError, NotFoundError } = require('../core/error.response')
const EmailService = require('./email.service')
const OtpService = require('./otp.service')
const Utils = require('../utils')
const UserRepository = require('./repositories/user.repo')
const bycrypt = require("bcrypt")
const crypto = require("crypto")
const KeyService = require('./key.service')
const AuthUtils = require('../auth/auth.utils')
const { USER } = require('../configs/contants')

class UserService {
    static async newUser({
        email = null,
        captcha = null,
    }){
        // 1. check email
        const user = await UserRepository.findUserByEmail({email})
        if(user) return new ConflictRequestError('Email already exists')
        
        // 2. send token via email user
        const result = await EmailService.sendEmailToken({
            email: email
        })
        
        return {
            token: result
        }
    }

    static async checkLoginEmailToken({
        token = null
    }){
        // 1. check token
        const { otp_email: email, otp_token } = await OtpService.checkEmailToken({
            token
        })
        if(!email) throw new NotFoundError('Token not found')

        // 2. check email
        const hasUser = await UserRepository.findUserByEmail({email})
        if(hasUser) throw new NotFoundError('Email Is Exists')
        
        // 3. new user
        const passwordHash = await bycrypt.hash(email, 10)

        const newUser = await UserRepository.createUser({
            usr_email: email,
            usr_password: passwordHash,
            usr_name: email,
            usr_slug: Utils.createSlug(email)
        })

        if(newUser){
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
                userId: newUser._id,
                publicKey: publicKey,
            }) 

            const tokens = await AuthUtils.createTokenPair({
                payload: {
                    userId: newUser._id,
                    email: email
                },
                privateKey: privateKey
            })

            if(!publicKeyDbs){
                throw new BadRequestError("Error Generate Public Key")
            }

            return {
                user: Utils.getInfoData({
                    field: ["_id", "usr_name", "usr_email"],
                    object: newUser
                }),
                tokens
            }
        }
    }
}

module.exports = UserService