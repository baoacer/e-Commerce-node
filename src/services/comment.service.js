"use strict";

const Utils = require("../utils/index");
const CommentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");
const ProductRepository = require("./repositories/product.repo");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    commentParentId = null,
  }) {
    const comment = await CommentModel.create({
      comment_product_id: productId,
      comment_user_id: userId,
      comment_content: content,
      comment_parent_id: commentParentId,
    });

    let rightValue;
    if (commentParentId) {
      const parentComment = await CommentModel.findById(commentParentId);
      if (!parentComment) throw new NotFoundError("Comment not found");

      rightValue = parentComment.comment_right;
      await CommentModel.updateMany(
        {
          comment_product_id: Utils.convertObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await CommentModel.updateMany(
        {
          comment_product_id: Utils.convertObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_product_id: Utils.convertObjectId(productId),
        },
        "comment_right"
      ).sort({ comment_right: -1 });

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert new comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    skip = 0,
  }) {
    if (parentCommentId) {
        const parent = await CommentModel.findById(parentCommentId);
        if (!parent) throw new NotFoundError("Comment not found");

      const comments = await CommentModel.find({
        comment_product_id: Utils.convertObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parent_id: 1,
        })
        .sort({ comment_left: 1 })
        .limit(limit)
        .skip(skip);

      return comments;
    }

    const comments = await CommentModel.find({
      comment_product_id: Utils.convertObjectId(productId),
      comment_parent_id: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parent_id: 1,
      })
      .sort({ comment_left: 1 })
      .limit(limit)
      .skip(skip);

    return comments;
  }

  static async deleteComment({
    productId, commentId
  }){
    const foundProduct = await ProductRepository.findProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = await CommentModel.findById(commentId)
    if (!comment) throw new NotFoundError("Comment not found");

    const { comment_left, comment_right } = comment

    const width = comment_right - comment_left + 1;

    await CommentModel.deleteMany({
      comment_product_id: Utils.convertObjectId(productId),
      comment_left: { $gte: comment_left },
      comment_right: { $lte: comment_right },
    });

    await CommentModel.updateMany({
        comment_product_id: Utils.convertObjectId(productId),
        comment_right: { $gt: comment_right },
    },{
        $inc: { comment_right: -width },
    })

    await CommentModel.updateMany({
          comment_product_id: Utils.convertObjectId(productId),
          comment_left: { $gt: comment_right },
    },{
        $inc: { comment_left: -width },
    })

  }
}

module.exports = CommentService;
