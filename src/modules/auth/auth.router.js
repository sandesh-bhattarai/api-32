const authRouter = require("express").Router();
const HttpResponseCode = require("../../constants/http-status-code.constant");
const HttpResponse = require("../../constants/response-status.constant");
const {checkLogin,refreshToken} = require("../../middlewares/auth.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const authCtrl = require("./auth.controller");
const {userRegistrationDTO, loginDTO, activationDTO, resendOtpDTO} = require("./auth.request")
const {uploadFile} = require("../../middlewares/multipart-parser.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");

// REST 

// .none() => if there are not any files upload
// .single('fieldname') => if there is only a single file upload option in fieldName
authRouter.post('/register',uploadFile('image').single('profileImage'), bodyValidator(userRegistrationDTO),  authCtrl.register)
authRouter.post("/activate", bodyValidator(activationDTO), authCtrl.activateUser)
authRouter.post('/resend-otp',  bodyValidator(resendOtpDTO), authCtrl.resendOtp)

authRouter.post('/login',bodyValidator(loginDTO), authCtrl.login)

authRouter.get('/me', checkLogin, authCtrl.getLoggedInUser)


authRouter.get("/refresh",refreshToken, authCtrl.refreshToken)

// can be accessed by only admin 
authRouter.get("/all-admin", checkLogin, checkPermission(['admin']),  authCtrl.getUsers)

authRouter.get('/user-by-type', checkLogin, checkPermission(['admin']), authCtrl.getUserList)

authRouter.post("/:id", checkLogin,authCtrl.updateUserById)



// forget password 
// reset password

module.exports = authRouter