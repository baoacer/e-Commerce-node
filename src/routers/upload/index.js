const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const UploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
const router = express.Router()
    
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadImageFromLocal))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(UploadController.uploadImageFromLocalFiles))

// Upload S3
// memory upload have buffer
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(UploadController.uploadImageFromLocalS3))

module.exports = router      