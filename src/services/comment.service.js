'use strict'
const Utils = require('../utils/index');
const CommentModel = require('../models/comment.model');

class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentId
    }){
       const comment = CommentModel.create({
              comment_product_id: productId,
              comment_user_id: userId,
              comment_content: content,
              comment_parent_id: parentId
       })

       let rightValue
       if(parentId){
            
       }else{
            const maxRightValue = await CommentModel.find({
                comment_product_id: Utils.convertObjectId(productId)
            }, 'comment_right').sort({comment_right: -1})

            if(maxRightValue){
                rightValue = maxRightValue.comment_right + 1
            }else{
                rightValue = 1
            }
       }

        // insert new comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
       
        await comment.save()
        return comment
    }
}

module.exports = new CommentService();