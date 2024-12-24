const { checkLogin } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");
const {uploadFile} = require("../../middlewares/multipart-parser.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const { BannerCreateDTO, BannerUpdateDTO } = require("./banner.request");
const bannerCtrl = require("./banner.controller");

const bannerRouter = require("express").Router()

// CRUD 
// /banner
// Home page banner (No auth required)
bannerRouter.get("/home-banner", bannerCtrl.getForHomePage)


// group 
bannerRouter.route('/')
    .post(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(BannerCreateDTO), bannerCtrl.storeBanner)
    .get(checkLogin, checkPermission(['admin']), bannerCtrl.listAllData);

bannerRouter.route("/:id")
    .get(checkLogin, checkPermission(['admin']), bannerCtrl.getById)    
    .put(checkLogin, checkPermission(['admin']), uploadFile().single('image'), bodyValidator(BannerUpdateDTO), bannerCtrl.updateBanner)
    .delete(checkLogin, checkPermission(['admin']), bannerCtrl.deleteById)   

module.exports = bannerRouter