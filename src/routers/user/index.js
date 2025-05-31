const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const UserController = require('../../controllers/user.controller')
const router = express.Router()
    
router.post('/new-user', asyncHandler(UserController.newUser))
router.get('/welcome-back', asyncHandler(UserController.checkLoginEmailToken))

module.exports = router