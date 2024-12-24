const HttpResponse = require("../../constants/response-status.constant");
const productSvc = require("./product.service")

class ProductController {
    storeProduct = async(req, res, next) => {
        try {
            let data = await productSvc.transformProductCreateData(req);
            let productObj = await productSvc.createProduct(data);
            res.json({
                data: productObj, 
                message: "Product Created Successfully",
                status: HttpResponse.product.create_success,
                options: null
            })
        } catch(exception) {
            console.log("StoreProduct: ", exception)
            next(exception)
        }
    }

    updateProduct = async(req, res, next) => {
        try {
            const productExists = await productSvc.getDataById(req.params.id);
            const data = await productSvc.transformProductUpdateData(req, productExists)
            const updated = await productSvc.updateSingleProductById(req.params.id, data)
            res.json({
                data: updated, 
                message: "Product Updated Successfully.",
                status: HttpResponse.product.update_success,
                options: null
            })
        } catch(exception) {
            console.log("updateProduct", exception)
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
            let data = await productSvc.listAllProductData({
                limit: limit, 
                skip: skip,
                filter: filter
            })

            let totalCount = await productSvc.totalCount(filter)
            res.json({
                data: data, 
                message: "Product List",
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
            const data = await productSvc.getDataById(id);
            res.json({
                data: data, 
                message: "Product Detail",
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
            const productExits =await productSvc.getDataById(req.params.id)
            let deletedData = await productSvc.deleteById(req.params.id);
            res.json({
                data: deletedData, 
                message: "Product Deleted successfully.",
                status: HttpResponse.product.delete_success, 
                options: null
            })
        } catch(exception) {
            console.log("deleteById", exception)
            next(exception)
        }
    }

    getForHomePage = async(req, res, next) => {
        try {
            let data = await productSvc.listAllProductData({
                limit: 16, 
                page: 1, 
                filter: {
                    status: "active"
                }
            })
            res.json({
                data: data, 
                message: "Product List for Home page",
                status: HttpResponse.product.list_for_home,
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
            const productDetail = await productSvc.getSingleProductByFilter({
                slug: slug,
                status: 'active',
            });

            let related = await productSvc.listAllProductData({
                skip: 0,
                limit: 8,
                filter: {
                    slug: {$ne: slug},
                    status: 'active',
                    category: productDetail.category._id
                }
            })
            // review => {productId: productDetail._id}
            // review => [{rate: 5, review: null},{rate: 4, review: null},{rate: 3, "test value"}, {rate: 0, review: "test"}]
            // avg => 0-5 => (5+4+3+1)/4 => 3.25
            res.json({
                data: {
                    detail: productDetail, 
                    related: related,
                    review: [{
                        _id: "1213123",
                        reviewdBy: {
                            email: "sandesh.bhattarai79@gmail.com",
                            name:"Sandesh Bhattarai",
                            role: "admin",
                            _id: "672b615311c0b2b512e60d03",
                            image: "http://res.cloudinary.com/diijizcvp/image/upload/v1730896211/users/jqcgbx56se2a3dsdf9ey.png"
                        },
                        rate: 3, 
                        review: "My review"
                    }]
                }, 
                message: "Product Detail",
                status: HttpResponse.product.list_success
            })
        } catch(exception) {
            next(exception)
        }
    }
}

const productCtrl = new ProductController()

module.exports = productCtrl;