
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()
    
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProducts))
router.get('', asyncHandler(ProductController.getAllProducts))  
router.get('/:productId', asyncHandler(ProductController.getProduct))  
 
router.use(AuthUtils.authentication)

router.post('', asyncHandler(ProductController.createProduct))
router.post('/publish/:productId', asyncHandler(ProductController.publishProductByShop))
router.post('/unPublish/:productId', asyncHandler(ProductController.unPublishProductByShop))

// query
router.get('/drafts', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/publishs', asyncHandler(ProductController.getAllPublishsForShop))

module.exports = router