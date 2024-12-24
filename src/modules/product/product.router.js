const { checkLogin } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");
const {uploadFile} = require("../../middlewares/multipart-parser.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const { ProductCreateDTO, ProductUpdateDTO } = require("./product.request");
const productCtrl = require("./product.controller");

const productRouter = require("express").Router()

// CRUD 
// /product
// Home page product (No auth required)
productRouter.get("/home-product", productCtrl.getForHomePage)

productRouter.get("/:slug/by-slug", productCtrl.getDetailBySlug)


// group 
productRouter.route('/')
    .post(checkLogin, checkPermission(['admin','seller']), uploadFile().array('images'), bodyValidator(ProductCreateDTO), productCtrl.storeProduct)
    .get(checkLogin, checkPermission(['admin','seller']), productCtrl.listAllData);

productRouter.route("/:id")
    .get(checkLogin, checkPermission(['admin','seller']), productCtrl.getById)    
    .put(checkLogin, checkPermission(['admin','seller']), uploadFile().array('images'), bodyValidator(ProductUpdateDTO), productCtrl.updateProduct)
    .delete(checkLogin, checkPermission(['admin','seller']), productCtrl.deleteById)   

module.exports = productRouter