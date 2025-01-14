'use strict'

const {SuccessResponse} = require('../core/success.response')
const commentService = require('../services/comment.service')

class CommentController {

    static createComment = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Checkout Success!",
            metadata: await commentService.create
        }).send(res)
    }
   
}

module.exports = CheckoutController