const { checkLogin } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");
const {uploadFile} = require("../../middlewares/multipart-parser.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const { BrandCreateDTO, BrandUpdateDTO } = require("./brand.request");
const brandCtrl = require("./brand.controller");

const brandRouter = require("express").Router()

// CRUD 
// /brand
// Home page brand (No auth required)
brandRouter.get("/home-brand", brandCtrl.getForHomePage)

brandRouter.get("/:slug/by-slug", brandCtrl.getDetailBySlug)


// group 
brandRouter.route('/')
    .post(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(BrandCreateDTO), brandCtrl.storeBrand)
    .get(checkLogin, checkPermission(['admin']), brandCtrl.listAllData);

brandRouter.route("/:id")
    .get(checkLogin, checkPermission(['admin']), brandCtrl.getById)    
    .put(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(BrandUpdateDTO), brandCtrl.updateBrand)
    .delete(checkLogin, checkPermission(['admin']), brandCtrl.deleteById)   

module.exports = brandRouter