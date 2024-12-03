const { CREATED } = require('../core/success.response')
const accessService = require('../services/access.service')

class AccessController{

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register Success!",
            status: 201,
            metadata: await accessService.signUp(req.body)
        }).send(res) 
    }
}

module.exports = new AccessController()