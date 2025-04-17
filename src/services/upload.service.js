'use strict'
const cloudinary = require('../configs/cloudinary.config')

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/shopID',
}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        })
        return {
            image_url: result.secure_url,
            shopID: '0000',
            thumb_url: await cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                quality: 'auto',
                format: 'jpg',
            })
        }
    } catch (error) {
        console.error('Error upload image', error)
    }
}

const uploadImageFromLocalFiles = async ({
    files,
    folderName = 'product/shopID',  
}) => {
    try {
        if(!files.length) return
        const uploadedFiles = []
        for(const file of files){
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            })
            uploadedFiles.push({
                image_url: result.secure_url,
                shopID: '0000',
                thumb_url: await cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    quality: 'auto',
                    format: 'jpg',
                })
            })
        }

        return uploadedFiles
    } catch (error) {
        console.error('Error upload image', error)
    }
}

module.exports = { 
    uploadImageFromLocal, 
    uploadImageFromLocalFiles
}