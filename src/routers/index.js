"use strict";

const express = require("express")
const CheckAuth = require("../auth/check.auth")
const router = express.Router()

router.use(CheckAuth.apiKey)
router.use(CheckAuth.permission("0"))

router.use('/v1/api/product', require('./product/index'))
router.use('/v1/api/shop', require('./access/index'))

module.exports = router