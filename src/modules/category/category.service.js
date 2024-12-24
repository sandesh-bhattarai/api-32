const FileUploadService = require("../../services/cloudinary.service");
const CategoryModel = require("./category.model");
const HttpResponseCode = require("../../constants/http-status-code.constant")
const HttpResponse = require("../../constants/response-status.constant");
const slugify = require("slugify")

class CategoryService {
    transformCategoryCreateData = async(req) => {
        try {
            let data = req.body; 
            let file = req.file; 

            if(!file) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Image is required", detail: {image: "Image is required"}, statusCode: HttpResponse.validationFailed}
            }

            // foregin 
            if(!data.parentId || data.parentId === '') {
                data.parentId = null;
            }

            data.image = await FileUploadService.uploadFile(file.path, '/category');
            data.slug = slugify(data.title, {lower: true})

            data.createdBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    transformCategoryUpdateData = async(req, oldValue) => {
        try {
            let data = req.body; 
            let file = req.file; 
            if(!file) {
                data.image = oldValue.image;
            } else {
                data.image = await FileUploadService.uploadFile(file.path, '/category');
            }
            if(!data.parentId || data.parentId === '') {
                data.parentId = null;
            }
            data.updateBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    createCategory = async(data) => {
        try {
            const categoryObj = new CategoryModel(data)
            return await categoryObj.save()
        } catch(exception) {
            throw exception;
        }
    }

    totalCount = async(filter) => {
        try {
            const count = await CategoryModel.countDocuments(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    listAllCategoryData = async({
        limit=10,
        skip=0,
        filter={}
    }) => {
        try {
            const data = await CategoryModel.find(filter)
                    .populate("parentId", ["_id",'title','slug'])
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
            const categoryDetail = await CategoryModel.findById(id)
                .populate("createdBy", ["_id",'name','email','role'])
                .populate("updateBy", ["_id",'name','email','role'])
            if(!categoryDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Category Does not exists", statusCode: HttpResponse.notFound}
            }
            return categoryDetail
        } catch(exception) {
            throw exception;
        }
    }

    getSingleDataByFilter = async(filter) => {
        try {
            const categoryDetail = await CategoryModel.findOne(filter)
                .populate("createdBy", ["_id",'name','email','role'])
                .populate("updateBy", ["_id",'name','email','role'])
            if(!categoryDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Category Does not exists", statusCode: HttpResponse.notFound}
            }
            return categoryDetail
        } catch(exception) {
            throw exception;
        }
    }

    updateSingleCategoryById = async(id, data) => {
        try {
            const categoryUpdate = await CategoryModel.findByIdAndUpdate(id, {$set: data}, {new: true});    // after update
            if(!categoryUpdate) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Category Cannot be updated.", statusCode: HttpResponse.category.update_error}
            }
            return categoryUpdate;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            const deleted = await CategoryModel.findByIdAndDelete(id);
            if(!deleted) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Category Cannot be deleted.", statusCode: HttpResponse.category.delete_error}
            }
            return deleted;
        } catch(exception) {
            throw exception
        }
    }
    // TODO: 
}

const categorySvc = new CategoryService()
module.exports = categorySvc;