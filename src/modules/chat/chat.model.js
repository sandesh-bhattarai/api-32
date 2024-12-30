const { default: mongoose, mongo } = require("mongoose");

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String, 
        required: true
    },
    seen: {
        type: Boolean, 
        default: false
    }
}, {
    autoCreate: true, 
    autoIndex: true, 
    timestamps: true
})

const ChatModel = mongoose.model("Chat", ChatSchema)

module.exports = ChatModel