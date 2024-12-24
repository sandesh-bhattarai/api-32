const FileUploadService = require("../../services/cloudinary.service");
const ProductModel = require("./product.model");
const HttpResponseCode = require("../../constants/http-status-code.constant")
const HttpResponse = require("../../constants/response-status.constant");
const slugify = require("slugify")

class ProductService {
    transformProductCreateData = async(req) => {
        try {
            let data = req.body; 
            let files = req.files; 
            
            let images = [];
            // 
            if(files && files.length > 0) { // 4
                // images = []
                for(let image of files) { // 3 index => 4
                    let uploadImage = await FileUploadService.uploadFile(image.path, '/product');
                    // images.push(uploadImage)      => images = [1,2,3,4]
                    images.push(uploadImage)
                }
                //  images = [1,2,3,4]
            }
            data.images = images;

            // foreign, categoryid, brandId, admin create seller
            if(!data.category || data.category === '') {
                data.category = null
            }

            if(!data.brand || data.brand === '') {
                data.brand = null
            }

            if(req.loggedInUser.role === 'seller') {
                data.seller = req.loggedInUser._id
            } else if(req.loggedInUser.role === 'admin' && (!data.seller || data.seller === '')) {
                data.seller = null;
            }
            // 
            data.price = data.price * 100

            data.actualAmt = data.price - data.price * data.discount/100;

            data.slug = slugify(data.title, {lower: true})

            data.createdBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    transformProductUpdateData = async(req, oldValue) => {
        try {
            let data = req.body; 
            let files = req.files; 
            
            let images = [];
            // 
            if(files && files.length > 0) {
                for(let image of files) {
                    let uploadImage = await FileUploadService.uploadFile(image.path, '/product');
                    images.push(uploadImage)
                }
            } else {
                images = oldValue.images;
            }
            data.images = images;

            // foreign, categoryid, brandId, admin create seller
            if(!data.category || data.category === '') {
                data.category = null
            }

            if(!data.brand || data.brand === '') {
                data.brand = null
            }

            if(req.loggedInUser.role === 'seller') {
                data.seller = req.loggedInUser._id
            } else if(req.loggedInUser.role === 'admin' && (!data.seller || data.seller === '')) {
                data.seller = null;
            }
            data.price = data.price * 100

            data.actualAmt = data.price - data.price * data.discount/100;

            data.updatedBy = req.loggedInUser._id;
            return data;
        } catch(exception) {
            throw exception;
        }
    }

    createProduct = async(data) => {
        try {
            const productObj = new ProductModel(data)
            return await productObj.save()
        } catch(exception) {
            throw exception;
        }
    }

    totalCount = async(filter) => {
        try {
            const count = await ProductModel.countDocuments(filter)
            return count;
        } catch(exception) {
            throw exception
        }
    }

    listAllProductData = async({
        limit=10,
        skip=0,
        filter={}
    }) => {
        try {
            const data = await ProductModel.find(filter)
                    .populate("category", ["_id",'title','slug'])
                    .populate("brand", ["_id",'title','slug'])
                    .populate("seller", ["_id",'name','email','role'])
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
            const productDetail = await ProductModel.findById(id)
                .populate("category", ["_id",'title','slug'])
                .populate("brand", ["_id",'title','slug'])
                .populate("seller", ["_id",'name','email','role'])
                .populate("createdBy", ["_id",'name','email','role'])
                .populate("updateBy", ["_id",'name','email','role'])
            if(!productDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Product Does not exists", statusCode: HttpResponse.notFound}
            }
            return productDetail
        } catch(exception) {
            throw exception;
        }
    }

    getSingleProductByFilter = async(filter) => {
        try {
            const productDetail = await ProductModel.findOne(filter)
                .populate("category", ["_id",'title','slug'])
                .populate("brand", ["_id",'title','slug'])
                .populate("seller", ["_id",'name','email','role','image'])
                .populate("createdBy", ["_id",'name','email','role', 'image'])
                .populate("updateBy", ["_id",'name','email','role','image'])
            if(!productDetail) {
                throw {status: HttpResponseCode.NOT_FOUND, message: "Product Does not exists", statusCode: HttpResponse.notFound}
            }
            return productDetail
        } catch(exception) {
            throw exception;
        }
    }

    updateSingleProductById = async(id, data) => {
        try {
            const productUpdate = await ProductModel.findByIdAndUpdate(id, {$set: data}, {new: true});    // after update
            if(!productUpdate) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Product Cannot be updated.", statusCode: HttpResponse.product.update_error}
            }
            return productUpdate;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async(id) => {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id);
            if(!deleted) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Product Cannot be deleted.", statusCode: HttpResponse.product.delete_error}
            }
            return deleted;
        } catch(exception) {
            throw exception
        }
    }
    // TODO: 
}

const productSvc = new ProductService()
module.exports = productSvc;