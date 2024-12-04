const { CREATED, Ok } = require('../core/success.response')
const accessService = require('../services/access.service')

class AccessController{

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register Success!",
            status: 201,
            metadata: await accessService.signUp(req.body)
        }).send(res) 
    }

    login = async (req, res, next) => {
        new Ok({
            message: "Login Success!",
            status: 200,
            metadata: await accessService.login(req.body)
        }).send(res) 
    }

    logout = async (req, res, next) => {
        new Ok({
            message: "Login Success!",
            status: 200,
            metadata: await accessService.logout
        }).send(res) 
    }
}

module.exports = new AccessController()