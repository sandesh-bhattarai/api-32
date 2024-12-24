const FileUploadService = require("../../services/cloudinary.service");
const BrandModel = require("./brand.model");
const HttpResponseCode = require("../../constants/http-status-code.constant")
const HttpResponse = require("../../constants/response-status.constant");
const slugify = require("slugify")

class BrandService {
    transformBrandCreateData = async(req) => {
        try {
            let data = req.body; 
            let file = req.file; 

            if(!file) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Image is required", detail: {image: "Image is required"}, statusCode: HttpResponse.validationFailed}
            }

            data.image = await FileUploadService.uploadFile(file.path, '/brand');
            data.slug = slugify(data.title, {lower: true})

            data.createdBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    transformBrandUpdateData = async(req, oldValue) => {
        try {
            let data = req.body; 
            let file = req.file; 
            if(!file) {
                data.image = oldValue.image;
            } else {
                data.image = await FileUploadService.uploadFile(file.path, '/brand');
            }
            data.updateBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    createBrand = async(data) => {
        try {
            const brandObj = new BrandModel(data)
            return await brandObj.save()
        } catch(exception) {
            throw exception;
        }
    }

    totalCount = async(filter) => {
        try {
            const count = await BrandModel.countDocuments(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    listAllBrandData = async({
        limit=10,
        skip=0,
        filter={}
    }) => {
        try {
            const data = await BrandModel.find(filter)
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
            const brandDetail = await BrandModel.findById(id)
                .populate("createdBy", ["_id",'name','email','role'])
                .populate("updateBy", ["_id",'name','email','role'])
            if(!brandDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Brand Does not exists", statusCode: HttpResponse.notFound}
            }
            return brandDetail
        } catch(exception) {
            throw exception;
        }
    }

    updateSingleBrandById = async(id, data) => {
        try {
            const brandUpdate = await BrandModel.findByIdAndUpdate(id, {$set: data}, {new: true});    // after update
            if(!brandUpdate) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Brand Cannot be updated.", statusCode: HttpResponse.brand.update_error}
            }
            return brandUpdate;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            const deleted = await BrandModel.findByIdAndDelete(id);
            if(!deleted) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Brand Cannot be deleted.", statusCode: HttpResponse.brand.delete_error}
            }
            return deleted;
        } catch(exception) {
            throw exception
        }
    }
    getSingleBrandByFilter = async(filter) => {
        try {
            const brandDetail = await BrandModel.findOne(filter);
            if(!brandDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Brand Does not exists", statusCode: HttpResponse.notFound}
            }
            return brandDetail;
        } catch(exception) {
            throw exception;
        }
    }

    getBrandWithProductBySlug = async(slug) => {
        try {
            const products = await BrandModel.aggregate([
                {
                  '$match': {
                    'slug': slug
                  }
                }, {
                  '$lookup': {
                    'from': 'products', 
                    'localField': '_id', 
                    'foreignField': 'brand', 
                    'as': 'products'
                  }
                }, {
                  '$addFields': {
                    'products': {
                      '$sortArray': {
                        'input': '$products', 
                        'sortBy': {
                          'createdAt': -1
                        }
                      }
                    }
                  }
                }, {
                  '$addFields': {
                    'products': {
                      '$slice': [
                        '$products', 10
                      ]
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$products', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$lookup': {
                    'from': 'categories', 
                    'localField': 'products.category', 
                    'foreignField': '_id', 
                    'as': 'category'
                  }
                }
              ])
        } catch(exception) {
            throw exception;
        }
    }
}

const brandSvc = new BrandService()
module.exports = brandSvc;