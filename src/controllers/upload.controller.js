const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromLocal, uploadImageFromLocalFiles  } = require("../services/upload.service")
const { uploadImageFromLocalS3  } = require("../services/aws.upload.service")

class UploadController {
    static uploadImageFromLocal = async (req, res) => {
        const { file } = req
        if(!file) throw new BadRequestError("File missing!")
        new SuccessResponse({
            message: "Successfuly Upload Image From Local!",
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }

    static uploadImageFromLocalFiles = async (req, res) => {
        const { files } = req
        if(!files) throw new BadRequestError("Files missing!")
        new SuccessResponse({
            message: "Successfuly Upload Images From Local!",
            metadata: await uploadImageFromLocalFiles({
                files: files
            })
        }).send(res)
    }

    static uploadImageFromLocalS3 = async (req, res) => {
        const { file } = req
        if(!file) throw new BadRequestError("File missing!")
        new SuccessResponse({
            message: "Successfuly Upload File From Local to S3Client!",
            metadata: await uploadImageFromLocalS3({
                file
            })
        }).send(res)
    }
}
module.exports = UploadController