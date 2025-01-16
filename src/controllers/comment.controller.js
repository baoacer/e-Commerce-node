'use strict'

const {SuccessResponse} = require('../core/success.response')
const commentService = require('../services/comment.service')

class CommentController {

    static createComment = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Create Comment Success!",
            metadata: await commentService.createComment(req.body)
        }).send(res)
    }

    static getComments = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get Comments Success!",
            metadata: await commentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    static deleteComment = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Delete Comments Success!",
            metadata: await commentService.deleteComment(req.query)
        }).send(res)
    }
   
}

module.exports = CommentController