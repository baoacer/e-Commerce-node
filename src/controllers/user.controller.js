'use strict'
const { SuccessResponse } = require('../core/success.response')
const UserService = require('../services/user.service')
class UserController {

    //new user
    newUser = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Create new user success',
            metadata: await UserService.newUser({
                email: req.body.email,
            })
        }).send(res)
    }

    // check user token via Email
    checkLoginEmailToken = async (req, res, next) => {
        const { token } = req.query
        return new SuccessResponse({
            message: 'Check login email token success',
            metadata: await UserService.checkLoginEmailToken({
                token
            })
        }).send(res)
    }
}

module.exports = new UserController()