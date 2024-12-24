const FileUploadService = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs"); // bcrypt 
const { generateRandomString, generateDateTime } = require("../../utilities/helpers");
const UserModel = require("../user/user.model");
const mailSvc = require("../../services/mail.service");
const HttpResponseCode = require("../../constants/http-status-code.constant");
const HttpResponse = require("../../constants/response-status.constant");


class AuthService {
    generateActivationOtp = () => {
        return {
            activationToken: generateRandomString(6).toUpperCase(),            // otp 4-6
            expiryTime: generateDateTime(5)
        }
    }

    transformCreateUser = async (req) => {
        try {
            // transformation 
            const data = req.body;

            // single upload 
            const file = req.file;
            const formattedData = {
                name: data.fullName,
                email: data.email, 
                password: bcrypt.hashSync(data.password, 10),
                role: data.role, 
                address: data.address, 
                gender: data.gender, 
                telephone: data.telephone,
                image: await FileUploadService.uploadFile(file.path, '/users'), 
                status: "inactive", 
                activationToken: generateRandomString(6).toUpperCase(),            // otp 4-6
                expiryTime: generateDateTime(5)
            }

            return formattedData;
        } catch(exception) {
            throw exception;
        }
    }

    registerUser = async(data) => {
        try {
            console.log({data})
            const userObj = new UserModel(data);
            return await userObj.save()          // Promise<UserModel<T>>, insert or update
        } catch(exception) {
            throw exception
        }
    }

    sendActivationEmail = async(user) => {
        try {
            let msg = `Dear ${user.name}, <br />
            
            Your account has been successfully created. Please use the following OTP Code to activate your account. <br />
            Your Code is: <br />
            
            <strong style="color:#ff0000">${user.activationToken}</strong><br/>
            
            This code is valid for only 5 mins.<br/>

            Regards, <br/>
            System Admin <br/>
            <small>Please do not reply to this email via mail. </small>`
            
            await mailSvc.sendEmail(user.email, "Activate your account", msg)
            return true;
        }catch(exception) {
            throw exception
        }
    }


    resendActivationEmail = async(user) => {
        try {
            let msg = `Dear ${user.name}, <br />
            
            Your new otp code is: 
            
            <strong style="color:#ff0000">${user.otp}</strong><br/>
            
            This code is valid for only 5 mins.<br/>

            Regards, <br/>
            System Admin <br/>
            <small>Please do not reply to this email via mail. </small>`
            
            await mailSvc.sendEmail(user.email, "Re-Activation OTP Code", msg)
            return true;
        }catch(exception) {
            throw exception
        }
    }

    getUserByFilter = async (filter) => {
        try {
            const user = await UserModel.findOne(filter);
            if(!user) {
                throw {status: HttpResponseCode.BAD_REQUEST, message: "User Not found", statusCode: HttpResponse.validationFailed}
            }
            return user;
        } catch(exception) {
            throw exception;
        }
    }

    updateUserById = async(data, userId) => {
        try {
            const user = await UserModel.findByIdAndUpdate(userId, {
                $set: data
            })
            return user;
        } catch(exception) {
            throw exception
        }
    }

    getListOfUsers = async(filter) => {
        try {
            const users = await UserModel.find(filter).sort({name: "asc"})
            return users;
        } catch(exception) {
            throw exception;
        }
    }
}

const authSvc = new AuthService()
module.exports = authSvc