const {SuccessResponse} = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')

class CheckoutController {

    static checkoutReview = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Checkout Success!",
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
   
}

module.exports = CheckoutController