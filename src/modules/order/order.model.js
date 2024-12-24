const { default: mongoose, mongo } = require("mongoose");

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        requiured: true
    },
    subtotal: {
        type: Number, 
        required: true,
    },
    discount: {
        type: Number, 
        required: true
    },
    tax: {
        type: Number, 
    },
    serviceCharge: {
        type: Number, 
    },
    total: {
        type: Number, 
        required: true
    },
    orderDate: Date, 
    status: {
        type: String, 
        enum: ['new','completed','cancelled'],
        default: 'new'
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

const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel;