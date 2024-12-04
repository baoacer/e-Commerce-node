"use strict";

const express = require("express")
const accessController = require('../../controllers/access.controller')
const CheckAuth = require("../../auth/check.auth")
const asyncHandler = require("../../helpers/asyncHandler")
const router = express.Router()

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp))
router.post("/shop/login", asyncHandler(accessController.login))

// Authentication

router.post("/shop/login", asyncHandler(accessController.logout))



module.exports = router