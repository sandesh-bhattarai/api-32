const HttpResponse = require("../../constants/response-status.constant");
const brandSvc = require("./brand.service")
const productSvc = require('../product/product.service');

class BrandController {
    storeBrand = async(req, res, next) => {
        try {
            let data = await brandSvc.transformBrandCreateData(req);
            let brandObj = await brandSvc.createBrand(data);
            res.json({
                data: brandObj, 
                message: "Brand Created Successfully",
                status: HttpResponse.brand.create_success,
                options: null
            })
        } catch(exception) {
            console.log("StoreBrand: ", exception)
            next(exception)
        }
    }

    updateBrand = async(req, res, next) => {
        try {
            const brandExists = await brandSvc.getDataById(req.params.id);
            const data = await brandSvc.transformBrandUpdateData(req, brandExists)
            const updated = await brandSvc.updateSingleBrandById(req.params.id, data)
            res.json({
                data: updated, 
                message: "Brand Updated Successfully.",
                status: HttpResponse.brand.update_success,
                options: null
            })
        } catch(exception) {
            console.log("updateBrand", exception)
            next(exception)
        }
    }

    listAllData = async(req, res, next) => {
        try {
            // pagination 
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;
            // filter 
            let filter = {};
            if(req.query.keyword) {
                filter = {
                    $or: [
                        {title: new RegExp(req.query.keyword, 'i')},
                        {description: new RegExp(req.query.keyword, 'i')},
                    ]
                }
            }
            let data = await brandSvc.listAllBrandData({
                limit: limit, 
                skip: skip,
                filter: filter
            })

            let totalCount = await brandSvc.totalCount(filter)
            res.json({
                data: data, 
                message: "Brand List",
                status: "BANNER_LIST_SUCCESS",
                options: {
                    page: page, 
                    limit: limit, 
                    total: totalCount
                }
            })
        } catch(exception) {
            console.log("ListAllData", exception)
            next(exception)
        }
    }

    getById = async(req, res, next) => {
        try {
            const id = req.params.id;
            const data = await brandSvc.getDataById(id);
            res.json({
                data: data, 
                message: "Brand Detail",
                status: "BANNER_DETAIL",
                options: null
            })
        } catch(exception) {
            console.log("getById", exception);
            next(exception)
        }
    }

    deleteById = async(req, res, next) => {
        try {
            const brandExits =await brandSvc.getDataById(req.params.id)
            let deletedData = await brandSvc.deleteById(req.params.id);
            res.json({
                data: deletedData, 
                message: "Brand Deleted successfully.",
                status: HttpResponse.brand.delete_success, 
                options: null
            })
        } catch(exception) {
            console.log("deleteById", exception)
            next(exception)
        }
    }

    getForHomePage = async(req, res, next) => {
        try {
            let data = await brandSvc.listAllBrandData({
                limit: 16, 
                page: 1, 
                filter: {
                    status: "active"
                }
            })
            res.json({
                data: data, 
                message: "Brand List for Home page",
                status: HttpResponse.brand.list_for_home,
                options: null
            })
        } catch(exception) {
            console.log("getForHomePage", exception)
            next(exception)
        }
    }

    getDetailBySlug = async(req, res, next) => {
        try {
            const slug = req.params.slug;
            // const products = await brandSvc.getBrandWithProductBySlug(slug);
            const brandDetail = await brandSvc.getSingleBrandByFilter({slug: slug})

            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;
            // filter 
            let filter = {
                status: 'active',
                brand: brandDetail._id
            };
            if(req.query.keyword) {
                filter = {
                    ...filter,
                    $or: [
                        {title: new RegExp(req.query.keyword, 'i')},
                        {description: new RegExp(req.query.keyword, 'i')},
                    ]
                }
            }
            const totalCount = await productSvc.totalCount(filter);
            const products = await productSvc.listAllProductData({
                limit: limit, 
                skip: skip, 
                filter: filter
            })
            res.json({
                data: {
                    detail: brandDetail,
                    products: products
                },
                message: "Brand Detail",
                status: HttpResponse.brand.list_for_home,
                options: {
                    page: page, 
                    limit: limit, 
                    total: totalCount
                }
            })
        } catch(exception) {
            next(exception)
        }
    }
}

const brandCtrl = new BrandController()

module.exports = brandCtrl;