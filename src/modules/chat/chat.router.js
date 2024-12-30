const chatRouter = require("express").Router()
const { checkLogin } = require("../../middlewares/auth.middleware")
const { bodyValidator } = require("../../middlewares/request-validator.middleware")
const chatCtrl = require("./chat.controller")
const { ChatCreateDTO } = require("./chat.request")

chatRouter.get("/my-chat/:userId", checkLogin,chatCtrl.listChatDetail )
chatRouter.post('/create', checkLogin, bodyValidator(ChatCreateDTO), chatCtrl.storeChat)
module.exports = chatRouter