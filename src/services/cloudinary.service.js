require("dotenv").config();
const fs = require('fs');
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class FileUploadService {
    static async uploadFile(filePath, dir) {
        try {
            const cloudinaryFile = await cloudinary.uploader.upload(filePath, {
                folder: dir,
                resource_type: "auto",
                unique_filename: true
            })
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }
            //image => 
            return cloudinaryFile.url;
        } catch(exception) {
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }
            throw exception
        }
    }
}

module.exports = FileUploadService