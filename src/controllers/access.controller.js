const accessService = require('../services/access.service')

class AccessController{

    signUp = async (req, res, next) => {
        try {
            console.log(`P:::sign-up:::`, req.body)
            return res.status(201).json(await accessService.signUp(req.body))
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new AccessController()