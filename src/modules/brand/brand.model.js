const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        min: 3, 
        max: 100,
        unique: true,
    },
    // Lenovo => lenovo
    slug: {
        type: String, 
        unique: true,
        required: true
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'],
        default: "inactive"
    },
    description: String, 
    image: {
        type: String, 
        required: true,
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


const BrandModel = mongoose.model("Brand", BrandSchema)  // banners 

module.exports = BrandModel;