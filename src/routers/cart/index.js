const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()

router.post('', asyncHandler(CartController.addToCart))
router.post('/update', asyncHandler(CartController.update))
router.delete('', asyncHandler(CartController.delete))
router.get('', asyncHandler(CartController.getListUserCart))

module.exports = router