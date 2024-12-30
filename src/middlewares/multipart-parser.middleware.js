const multer = require("multer");
const HttpResponseCode = require("../constants/http-status-code.constant");
const HttpResponse = require("../constants/response-status.constant");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!fs.existsSync('./public')) {
            fs.mkdirSync('./public',{recursive: true})
        }
        cb(null,"./public")
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
});

const uploadFile = (filetype = 'image') => {
    const typeFilter = (req, file, cb) => {
        const ext = file.originalname.split(".").pop()
        if(filetype === 'image' && ['jpg','jpeg','png','svg','bmp','webp'].includes(ext.toLowerCase())) {
            cb(null, true)
        } else if (filetype === 'doc' && ['txt','pdf','csv','xslx','json','xls','ppt'].includes(ext.toLowerCase())) {
            cb(null, true)
        } else {
            cb({status: HttpResponseCode.BAD_REQUEST, message: "File format not supported", code: HttpResponse.validationFailed})
        }
    }


    return multer({
        storage: storage,
        fileFilter: typeFilter,
        limits: {
            fileSize: 5000000
        }
    })
}
module.exports = {
    uploadFile
}