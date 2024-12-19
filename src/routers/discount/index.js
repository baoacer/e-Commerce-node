const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const DiscountController = require('../../controllers/discount.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()

router.get('/list_by_shop', asyncHandler(DiscountController.getAllDiscountByShop))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountWithProduct))

router.use(AuthUtils.authentication)

router.post('', asyncHandler(DiscountController.createDiscount))
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.patch('/:code', asyncHandler(DiscountController.updateDiscount))
router.patch('/cancel', asyncHandler(DiscountController.cancelDiscount))
router.patch('/delete', asyncHandler(DiscountController.deleteDiscount))

module.exports = router