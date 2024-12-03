"use strict";

const express = require("express")
const access = require("./access/index")
const CheckAuth = require("../auth/check.auth")
const router = express.Router()

router.use(CheckAuth.apiKey)
router.use(CheckAuth.permission("0"))

router.use('/v1/api', access)

module.exports = router