const ChatModel = require("./chat.model")

class ChatService {

    listChatByFilter =async (filter) => {
        try {
            const data = await ChatModel.find(filter)
                .populate("sender", ['_id','name','role','email', 'image'])
                .populate("receiver", ['_id','name','role','email', 'image'])
            
            return data;
        } catch(exception) {
            console.log("ChatSvc.listChatByFilter", exception)
            throw exception
        }
    }

    createChat = async(data) => {
        try {
            const chat = new ChatModel(data);
            return await chat.save();
        } catch(exception) {
            console.log("ChatSvc.createChat", exception)
            throw exception
        }
    }
}
const chatSvc = new ChatService()
module.exports = chatSvc;