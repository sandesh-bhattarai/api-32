const HttpResponse = require("../../constants/response-status.constant");
const categorySvc = require("./category.service")
const productSvc = require("../product/product.service");

class CategoryController {
    storeCategory = async(req, res, next) => {
        try {
            let data = await categorySvc.transformCategoryCreateData(req);
            let categoryObj = await categorySvc.createCategory(data);
            res.json({
                data: categoryObj, 
                message: "Category Created Successfully",
                status: HttpResponse.category.create_success,
                options: null
            })
        } catch(exception) {
            console.log("StoreCategory: ", exception)
            next(exception)
        }
    }

    updateCategory = async(req, res, next) => {
        try {
            const categoryExists = await categorySvc.getDataById(req.params.id);
            const data = await categorySvc.transformCategoryUpdateData(req, categoryExists)
            const updated = await categorySvc.updateSingleCategoryById(req.params.id, data)
            res.json({
                data: updated, 
                message: "Category Updated Successfully.",
                status: HttpResponse.category.update_success,
                options: null
            })
        } catch(exception) {
            console.log("updateCategory", exception)
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
            let data = await categorySvc.listAllCategoryData({
                limit: limit, 
                skip: skip,
                filter: filter
            })

            let totalCount = await categorySvc.totalCount(filter)
            res.json({
                data: data, 
                message: "Category List",
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
            const data = await categorySvc.getDataById(id);
            res.json({
                data: data, 
                message: "Category Detail",
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
            const categoryExits =await categorySvc.getDataById(req.params.id)
            let deletedData = await categorySvc.deleteById(req.params.id);
            res.json({
                data: deletedData, 
                message: "Category Deleted successfully.",
                status: HttpResponse.category.delete_success, 
                options: null
            })
        } catch(exception) {
            console.log("deleteById", exception)
            next(exception)
        }
    }

    getForHomePage = async(req, res, next) => {
        try {
            let data = await categorySvc.listAllCategoryData({
                limit: 16, 
                page: 1, 
                filter: {
                    status: "active"
                }
            })
            res.json({
                data: data, 
                message: "Category List for Home page",
                status: HttpResponse.category.list_for_home,
                options: null
            })
        } catch(exception) {
            console.log("getForHomePage", exception)
            next(exception)
        }
    }

    detailBySlug = async(req, res, next) => {
        try {
            const slug = req.params.slug; 
            const catDetail = await categorySvc.getSingleDataByFilter({
                slug: slug,
                status: 'active'
            })

            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;
            // filter 
            let filter = {
                status: 'active',
                category: catDetail._id
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
                    detail: catDetail,
                    products: products
                },
                message: "Category Detail",
                status: HttpResponse.category.list_for_home,
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

const categoryCtrl = new CategoryController()

module.exports = categoryCtrl;