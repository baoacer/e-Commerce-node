"use strict";

const express = require("express")
const access = require("./access/index")
const router = express.Router()

router.use('/v1/api', access)

module.exports = router