const { CREATED, Ok, SuccessResponse } = require('../core/success.response')
const accessService = require('../services/access.service')

class AccessController{

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout Success!",
            metadata: await accessService.logout({ key: req.key})
        }).send(res) 
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register Success!",
            status: 201,
            metadata: await accessService.signUp(req.body)
        }).send(res) 
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login Success!",
            metadata: await accessService.login(req.body)
        }).send(res) 
    }
}

module.exports = new AccessController()