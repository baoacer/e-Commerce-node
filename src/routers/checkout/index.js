const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()
const CheckoutController = require('../../controllers/checkout.controller')

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router