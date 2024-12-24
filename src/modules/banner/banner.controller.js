const HttpResponse = require("../../constants/response-status.constant");
const bannerSvc = require("./banner.service")

class BannerController {
    storeBanner = async(req, res, next) => {
        try {
            let data = await bannerSvc.transformBannerCreateData(req);
            let bannerObj = await bannerSvc.createBanner(data);
            res.json({
                data: bannerObj, 
                message: "Banner Created Successfully",
                status: HttpResponse.banner.create_success,
                options: null
            })
        } catch(exception) {
            console.log("StoreBanner: ", exception)
            next(exception)
        }
    }

    updateBanner = async(req, res, next) => {
        try {
            const bannerExists = await bannerSvc.getDataById(req.params.id);
            const data = await bannerSvc.transformBannerUpdateData(req, bannerExists)
            const updated = await bannerSvc.updateSingleBannerById(req.params.id, data)
            res.json({
                data: updated, 
                message: "Banner Updated Successfully.",
                status: HttpResponse.banner.update_success,
                options: null
            })
        } catch(exception) {
            console.log("updateBanner", exception)
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
            let data = await bannerSvc.listAllBannerData({
                limit: limit, 
                skip: skip,
                filter: filter
            })

            let totalCount = await bannerSvc.totalCount(filter)
            res.json({
                data: data, 
                message: "Banner List",
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
            const data = await bannerSvc.getDataById(id);
            res.json({
                data: data, 
                message: "Banner Detail",
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
            const bannerExits =await bannerSvc.getDataById(req.params.id)
            let deletedData = await bannerSvc.deleteById(req.params.id);
            res.json({
                data: deletedData, 
                message: "Banner Deleted successfully.",
                status: HttpResponse.banner.delete_success, 
                options: null
            })
        } catch(exception) {
            console.log("deleteById", exception)
            next(exception)
        }
    }

    getForHomePage = async(req, res, next) => {
        try {
            let data = await bannerSvc.listAllBannerData({
                limit: 10, 
                page: 1, 
                filter: {
                    status: "active",
                    startDate: {$lte: new Date()},
                    endDate: {$gte: new Date()}
                }
            })
            res.json({
                data: data, 
                message: "Banner List for Home page",
                status: HttpResponse.banner.list_for_home,
                options: null
            })
        } catch(exception) {
            console.log("getForHomePage", exception)
            next(exception)
        }
    }

}

const bannerCtrl = new BannerController()

module.exports = bannerCtrl;