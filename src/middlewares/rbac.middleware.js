const HttpResponseCode = require("../constants/http-status-code.constant")
const HttpResponse = require("../constants/response-status.constant");

const checkPermission = (allowedby) => {
    return (req, res, next) => {
        if(!allowedby || allowedby.length === 0) {
            next({status: HttpResponseCode.ACCESS_DENIED, message: "User Role Required", statusCode: HttpResponse.emptyRole})
        } else if(!Array.isArray(allowedby)){
            next({status: HttpResponseCode.ACCESS_DENIED, message: "Allowed Roles should be an array", statusCode: HttpResponse.roleShouldBeArray})
        } else {
            const loggedInUserRole = req.loggedInUser.role;
            if(allowedby.includes(loggedInUserRole)) {
                // access provided
                next()
            } else {
                next({status: HttpResponseCode.ACCESS_DENIED, message: "You do not have permission to access this endpoint", statusCode: HttpResponse.accessDenied})
            }
        }
    }
}

module.exports = {
    checkPermission
}