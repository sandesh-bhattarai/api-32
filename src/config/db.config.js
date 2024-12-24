require("dotenv").config()  // to Load env values in this file 
const mongoose = require('mongoose');


const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_NAME,
            autoCreate: true, 
            autoIndex: true,  
        })
        console.log("DB server Connected successfully on: ", process.env.MONGODB_NAME)
    } catch(exception) {
        console.error("Error Establishing db Connect...")
        console.log(exception)
        // throw exception;
        process.exit(1);
    }
}

dbConnect();