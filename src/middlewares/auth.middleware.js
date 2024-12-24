require("dotenv").config();
const HttpResponseCode = require("../constants/http-status-code.constant")
const HttpResponse = require("../constants/response-status.constant")
const jwt = require("jsonwebtoken");
const authSvc = require("../modules/auth/auth.service");

const checkLogin = async(req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;
        if(!token) {
            throw {status: HttpResponseCode.UNAUTHENTICATED, message: "Login First", statusCode: HttpResponse.unauthenticated}
        }
        // token => ("Bearer token").split(" ") => ["Bearer", "token"].pop() => "token"
        token = token.split(" ").pop();

        // decode, verify
        const data = jwt.verify(token, process.env.JWT_SECRET);

        const user = await authSvc.getUserByFilter({
            _id: data.sub
        })

        //
        req.loggedInUser = {
            _id: user._id,
            name: user.name,
            role: user.role, 
            image: user.image, 
            email: user.email,
            address: user.address,
            telephone: user.telephone,
            gender: user.gender
        };
        next();
    } catch(exception) {
        // 
        if(exception instanceof jwt.TokenExpiredError) {
            next({status: HttpResponseCode.UNAUTHENTICATED, message: exception.message, statusCode: HttpResponse.tokenExpired})
        } else if(exception instanceof jwt.JsonWebTokenError){
            next({status: HttpResponseCode.UNAUTHENTICATED, message: exception.message, statusCode: HttpResponse.unauthenticated})
        } else {
            next(exception)
        }
    }
}

const refreshToken  = async(req, res, next) => {
    try {
        const refreshToken = req.headers['refresh'] || null; 
        if(!refreshToken) {
            next({status: HttpResponseCode.UNAUTHENTICATED, message: "Token Not Found", statusCode: HttpResponse.unauthenticated})
        }
        const data = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await authSvc.getUserByFilter({
            _id: data.sub
        })
        req.loggedInUser = {
            _id: user._id,
            name: user.name,
            role: user.role, 
            image: user.image, 
            email: user.email,
            address: user.address,
            telephone: user.telephone,
            gender: user.gender
        };
        next()
    } catch(exception) {
        next(exception)
    }
}
module.exports = {checkLogin, refreshToken}