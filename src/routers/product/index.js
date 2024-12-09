
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()
    
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProducts))

router.use(AuthUtils.authentication)

router.post('', asyncHandler(ProductController.createProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unPublish/:id', asyncHandler(ProductController.unPublishProductByShop))

// query
router.get('/drafts', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/publishs', asyncHandler(ProductController.getAllPublishsForShop))

module.exports = router