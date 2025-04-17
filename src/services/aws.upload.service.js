const cloudinary = require('cloudinary').v2;
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../configs/s3.config');
const Utils = require('../utils');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const imageUrlPublic = process.env.AWS_CLOUDFRONT || 'https://d3sc9pwlohuokt.cloudfront.net'

const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {
        const imageName = Utils.randomName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, //file.originalname || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg',
        })

        const result = await s3.send(command)

         // export url
        const singedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });
        const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
 
        return {
            url: `${imageUrlPublic}/${imageName}`,
            result 
        }
        // return {
        //     image_url: result.secure_url,
        //     shopID: '0000',
        //     thumb_url: await cloudinary.url(result.public_id, {
        //         width: 100,
        //         height: 100,
        //         quality: 'auto',
        //         format: 'jpg',
        //     })
        // }
    } catch (error) {
        console.error(`Error upload image use S3Client::: ${error}`)
    }
}

module.exports = {
    uploadImageFromLocalS3
}