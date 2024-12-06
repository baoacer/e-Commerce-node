
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()

router.use(AuthUtils.authentication)

router.post('', asyncHandler(ProductController.createProduct))

module.exports = router