const chatSvc = require("./chat.service");

class ChatController {
    listChatDetail = async (req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;
            const receiver = req.params.userId;

            const chatDetail = await chatSvc.listChatByFilter({
                $or: [
                    {sender: loggedInUser._id, receiver: receiver},
                    {receiver: loggedInUser._id, sender: receiver}
                ]
            })
            res.json({
                data: chatDetail,
                message: "Your chat Detail",
                status: "USER_CHAT_DETAIL",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }

    storeChat = async(req, res, next) => {
        try {
            let payload = req.body;
            payload['sender'] = req.loggedInUser._id;
            payload['seen'] = false;

            const chat = await chatSvc.createChat(payload)
            let allChats = await chatSvc.listChatByFilter({
                $or: [
                    {sender: req.loggedInUser._id, receiver: payload.receiver},
                    {receiver: req.loggedInUser._id, sender: payload.receiver}
                ]
            })
            res.json({
                data: allChats,
                message: "Your chat has been sent",
                status: "CHAT_SENT",
                meta: null
            })
        } catch(exception) {
            next(exception)
        }
    }
}
const chatCtrl = new ChatController()
module.exports = chatCtrl