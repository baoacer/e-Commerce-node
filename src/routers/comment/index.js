const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const CommentController = require('../../controllers/comment.controller')
const CheckAuth = require('../../auth/check.auth')
const Auth = require('../../auth/auth.utils')
const router = express.Router()

router.use(Auth.authentication)

router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getComments))
router.delete('', asyncHandler(CommentController.deleteComment))

module.exports = router