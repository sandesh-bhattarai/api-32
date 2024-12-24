const FileUploadService = require("../../services/cloudinary.service");
const BannerModel = require("./banner.model");
const HttpResponseCode = require("../../constants/http-status-code.constant")
const HttpResponse = require("../../constants/response-status.constant");

class BannerService {
    transformBannerCreateData = async(req) => {
        try {
            let data = req.body; 
            let file = req.file; 

            if(!file) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Image is required", detail: {image: "Image is required"}, statusCode: HttpResponse.validationFailed}
            }

            data.image = await FileUploadService.uploadFile(file.path, '/banner');

            data.createdBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    transformBannerUpdateData = async(req, oldValue) => {
        try {
            let data = req.body; 
            let file = req.file; 
            if(!file) {
                data.image = oldValue.image;
            } else {
                data.image = await FileUploadService.uploadFile(file.path, '/banner');
            }
            data.updateBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    createBanner = async(data) => {
        try {
            const bannerObj = new BannerModel(data)
            return await bannerObj.save()
        } catch(exception) {
            throw exception;
        }
    }

    totalCount = async(filter) => {
        try {
            const count = await BannerModel.countDocuments(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    listAllBannerData = async({
        limit=10,
        skip=0,
        filter={}
    }) => {
        try {
            const data = await BannerModel.find(filter)
                    .populate("createdBy", ["_id",'name','email','role'])
                    .populate("updateBy", ["_id",'name','email','role'])
                    .sort({"createdAt": "desc"})
                    .skip(skip)
                    .limit(limit);

            return data;
        } catch(exception) {
            throw exception
        }
    }

    getDataById = async(id) => {
        try {
            const bannerDetail = await BannerModel.findById(id)
                .populate("createdBy", ["_id",'name','email','role'])
                .populate("updateBy", ["_id",'name','email','role'])
            if(!bannerDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Banner Does not exists", statusCode: HttpResponse.notFound}
            }
            return bannerDetail
        } catch(exception) {
            throw exception;
        }
    }

    updateSingleBannerById = async(id, data) => {
        try {
            const bannerUpdate = await BannerModel.findByIdAndUpdate(id, {$set: data}, {new: true});    // after update
            if(!bannerUpdate) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Banner Cannot be updated.", statusCode: HttpResponse.banner.update_error}
            }
            return bannerUpdate;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            const deleted = await BannerModel.findByIdAndDelete(id);
            if(!deleted) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Banner Cannot be deleted.", statusCode: HttpResponse.banner.delete_error}
            }
            return deleted;
        } catch(exception) {
            throw exception
        }
    }
}

const bannerSvc = new BannerService()
module.exports = bannerSvc;