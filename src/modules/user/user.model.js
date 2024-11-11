const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    streetName: String,
    houseNo: String,
    wardNo: Number,
    municipality: String,
    district: String,
    state: String
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,   // Boolean, Date, Enum, Object, ObjectId, array,..., number
        max: 50, 
        min: 2,
        required: true,
    }, 
    email: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String, 
        enum: ['admin','seller','customer'],
        default: "customer"
    }, 
    gender: {
        type: String, 
        enum: ["male",'female','other']
    }, 
    // address: AddressSchema, 
    address: String,
    telephone: String, 
    image: String,
    status: {
        type: String, 
        enum: ['active','inactive'],
        default: 'inactive'
    }, 
    activationToken: String, 
    forgetToken: String, 
    expiryTime: Date,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true,        // createdAt, updatedAt,
    autoCreate: true, 
    autoIndex: true
});

// Snake Case => Model Name => singular Form in CamelCase
// model will create a collection/table in our db with plural form your model name
// collection name will always be in plural form and in small case , users
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;