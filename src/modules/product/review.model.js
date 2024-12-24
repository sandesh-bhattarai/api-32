const mongoose = require("mongoose")
const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    reviewdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    rate: {
        type: Number, 
        min: 0,
        max: 5,
        default: 0
    },
    review: {
        type: String, 
        default: null
    }
},{
    autoCreate: true, 
    autoIndex: true, 
    timestamps: true
})

const ReviewModel = mongoose.model('Review', ReviewSchema)
module.exports = ReviewModel;