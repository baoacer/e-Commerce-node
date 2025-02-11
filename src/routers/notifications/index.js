"use strict";

const express = require("express")
const NofiticationController = require('../../controllers/notification.controller')
const asyncHandler = require("../../helpers/asyncHandler")
const AuthUtils = require("../../auth/auth.utils")
const router = express.Router()

// not login

// Authentication
router.use(AuthUtils.authentication)

// login
router.get('', asyncHandler(NofiticationController.listNotiByUser))
    
module.exports = router