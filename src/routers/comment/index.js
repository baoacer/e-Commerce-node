const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router