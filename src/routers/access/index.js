"use strict";

const express = require("express")
const accessController = require('../../controllers/access.controller')
const CheckAuth = require("../../auth/check.auth")
const router = express.Router()

// sign up
router.post("/signup", CheckAuth.asyncHandler(accessController.signUp))


module.exports = router