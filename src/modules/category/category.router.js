const { checkLogin } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");
const {uploadFile} = require("../../middlewares/multipart-parser.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const { CategoryCreateDTO, CategoryUpdateDTO } = require("./category.request");
const categoryCtrl = require("./category.controller");

const categoryRouter = require("express").Router()

// CRUD 
// /category
// Home page category (No auth required)
categoryRouter.get("/home-category", categoryCtrl.getForHomePage)

// TODO: Slug based product list for category
categoryRouter.get('/:slug/by-slug', categoryCtrl.detailBySlug)

// group 
categoryRouter.route('/')
    .post(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(CategoryCreateDTO), categoryCtrl.storeCategory)
    .get(checkLogin, checkPermission(['admin']), categoryCtrl.listAllData);

categoryRouter.route("/:id")
    .get(checkLogin, checkPermission(['admin']), categoryCtrl.getById)    
    .put(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(CategoryUpdateDTO), categoryCtrl.updateCategory)
    .delete(checkLogin, checkPermission(['admin']), categoryCtrl.deleteById)   

module.exports = categoryRouter