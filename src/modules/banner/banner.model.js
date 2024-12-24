const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        min: 3, 
        max: 100
    },
    startDate: {
        type: Date, 
        required: true
    }, 
    endDate: {
        type: Date, 
        required: true
    }, 
    link: {
        type: String, 
        default: null
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


const BannerModel = mongoose.model("Banner", BannerSchema)  // banners 

module.exports = BannerModel;