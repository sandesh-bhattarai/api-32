const { default: mongoose, mongo } = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        requiured: true
    },
    amount: {
        type: Number, 
        required: true
    },
    transactionDate: Date, 
    transactionCode: String,
    paymentMethods: {
        type: String, 
        enum: ['cash','esewa','khalti','bank','connectips', 'other']
    },
    response: {
        type: String
    },
    status: {
        type: String, 
        enum: ['paid','refund']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
}, {
    autoCreate: true, 
    autoIndex: true, 
    timestamps: true
})

const TransactionModel = mongoose.model("Transaction", TransactionSchema)
module.exports = TransactionModel;