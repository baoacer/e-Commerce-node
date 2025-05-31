const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const EmailController = require('../../controllers/email.controller')
const router = express.Router()
    
router.post('/new-template', asyncHandler(EmailController.newTemplate))

module.exports = router