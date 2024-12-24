const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        min: 3, 
        max: 100,
        unique: true,
    },
    slug: {
        type: String, 
        unique: true,
        required: true
    },
    // nth level 
    // A => B => C => D => E .... nth
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
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


const CategoryModel = mongoose.model("Category", CategorySchema)  // banners 

module.exports = CategoryModel;