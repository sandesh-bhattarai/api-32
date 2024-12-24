const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        min: 3, 
        max: 100
    },
    slug: {
        type: String, 
        unique: true,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default: null
    },
    price: {
        type: Number, 
        required: true, 
        min: 100
    },
    discount: {
        type: Number, 
        default: 0,
        max: 100,
        min: 0
    },
    actualAmt: {
        type: Number, 
        required: true
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'],
        default: "inactive"
    },
    description: String, 
    images: [{
        type: String
    }],
    seller: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    updateBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
}, {
    timestamps: true,       // createdAt, updatedAt, 
    autoCreate: true, 
    autoIndex: true
});


const ProductModel = mongoose.model("Product", ProductSchema)  // banners 

module.exports = ProductModel;