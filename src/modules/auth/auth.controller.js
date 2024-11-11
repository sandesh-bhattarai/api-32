require("dotenv").config();
const HttpResponseCode = require("../../constants/http-status-code.constant");
const HttpResponse = require("../../constants/response-status.constant")
const authSvc = require("./auth.service")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");


class AuthController  {
    register =async (req, res, next) => {
        try {
            // transformation 
            const formattedData= await authSvc.transformCreateUser(req);
            const user = await authSvc.registerUser(formattedData)

            // notify user sms (twilio, sns aws, hamro sms, sparrow sms)
            // email (SMTP server => domain verify, gmail , nodemailer)
            // push notification(mobile app or web-notification, socket )
            // forward email to send the otp code 
            await authSvc.sendActivationEmail(user);
            res.json({
                data: user, 
                message: "Register Request",
                status: HttpResponse.success,
                options: null
            })
        } catch(exception) {
            console.log(exception)
            next(exception)
        }
    }

    activateUser = async(req, res, next) => {
        try {
            const {email, otp} = req.body
            const user = await authSvc.getUserByFilter({
                email: email
            })

            if(user.status !== 'inactive') {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "User already activated!", statusCode: HttpResponse.validationFailed}
            }

            if(user.activationToken !== otp) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "Incorrect OTP Code", statusCode: HttpResponse.validationFailed}
            }

            let today = new Date();
            today = today.getTime() // time in milisecond
            let otpExpiryTime = user.expiryTime;
            otpExpiryTime = otpExpiryTime.getTime();

            if((today - otpExpiryTime) > 0) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "OTP Code expired", statusCode: HttpResponse.validationFailed}
            }

            // activate 
            const update = await authSvc.updateUserById({
                status: "active",
                expriyTime: null, 
                activationToken: null
            }, user._id)

            res.json({
                data: null, 
                message: "Account activated successfully. Please login to continue.",
                status: HttpResponse.success,
                options: null
            })
            
        } catch(exception) {
            console.log(exception);
            next(exception);
        }
    }

    resendOtp = async(req, res, next) => {
        try {
            const {email} = req.body;
            const user = await authSvc.getUserByFilter({
                email: email
            })

            if(user.status !== 'inactive') {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "User already activated!", statusCode: HttpResponse.validationFailed}
            }

            const newOtpCodes = authSvc.generateActivationOtp();

            await authSvc.updateUserById(newOtpCodes, user._id)

            // email
            await authSvc.resendActivationEmail({email: user.email, otp: newOtpCodes.activationToken, name: user.name})

            res.json({
                data: null, 
                message: "A new otp code has been delivered to your email.",
                status: HttpResponse.success,
                options: null
            })

        } catch(exception) {
            console.log(exception)
            next(exception)
        }
    }

    login = async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const user = await authSvc.getUserByFilter({
                email: email
            })

            if(user.status !== 'active') {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "User not activated", statusCode: HttpResponse.user.notActivate}
            }else {
                // password 
                if(bcrypt.compareSync(password, user.password)) {
                    // login  success
                    // token, JWT => Json Web Token 
                    const payload = {
                        sub: user._id
                    }
                    const token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: "10h"
                    })

                    res.json({
                        data: {
                            token: token,
                            detail: {
                                _id: user._id, 
                                name: user.name, 
                                email: user.email, 
                                role: user.role,
                                image: user.image
                            }
                        }, 
                        message: "Login Success.",
                        status: HttpResponse.success,
                        options: null
                    })

                } else {
                    throw {status: HttpResponseCode.BAD_REQUEST, message: "Credential does not match", statusCode: HttpResponse.user.credentialNotMatch}
                }
            }
        } catch(exception) {
            console.log(exception)
            next(exception);
        }
    }

    getLoggedInUser = (req, res, next) => {
        try {
            res.json({
                data: req.loggedInUser, 
                message: "User Profile Fetched.",
                status: HttpResponse.success,
                options: null
            })
        }catch(exception) {
            next(exception)
        }
    }

    updateUserById =  (req, res, next) => {
        // update user profile
        // login check 
        const params = req.params;  //object 
        const query = req.query || null;
        const headers = req.headers;

        // body // payload provided by FE or api call
        // parsers
        const data = req.body;

    }

    getUsers = (req, res, next) => {
        // loggedinuser => admin
        res.json({
            data: req.loggedInUser, 
            message: "User Profile Fetched.",
            status: HttpResponse.success,
            options: null
        })
    } 

}

const authCtrl = new AuthController()

module.exports = authCtrl;