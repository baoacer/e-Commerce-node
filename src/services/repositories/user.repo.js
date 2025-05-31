'use strict'
const USER = require('../../models/user.model')

class UserRepository {
    static async createUser({
        usr_email,
        usr_password,
        usr_name,
        usr_slug
    }){
        return await USER.create({
            usr_email,
            usr_password,
            usr_name,
            usr_slug
        })
    }

    static async findUserByEmail({
        email
    }){
        return await USER.findOne({
            usr_email: email
        }).lean()
    }
}

module.exports = UserRepository