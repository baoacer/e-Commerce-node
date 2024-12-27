const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const InventoryController = require('../../controllers/inventory.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()

router.use(AuthUtils.authentication)

router.post('', asyncHandler(InventoryController.addStockToInventory))

module.exports = router