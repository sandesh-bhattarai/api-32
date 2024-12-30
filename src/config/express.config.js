// import express from "express";
const express = require('express')
const router = require('./router.config')
const HttpResponseCode = require('../constants/http-status-code.constant')
const HttpResponse = require('../constants/response-status.constant')
require("./db.config");
const cors = require('cors');

const application = express()

// allow cors
application.use(cors());

// parser
application.use(express.json())
application.use(express.urlencoded({
    extended: true
}))


// healthcheck
application.use('/health', (request, response) => {
    response.json({
        data: null,
        message: "Success",
        status: HttpResponse.success,
        options: null
    })
    
})


// router
application.use('/api/v1', router)
application.use(router)

application.use((req, res, next) => {
    next({status: HttpResponseCode.NOT_FOUND, message: "Not found", statusCode: HttpResponse.notFound})
})


// (error, request, response, nextFunction) => error handling midddleware/garbage collector
application.use((error, req, res, next) => {
    console.log("GarbageError:", error)

    let statusCode = error.status || HttpResponseCode.INTERNAL_SERVER_ERROR;
    let message  = error.message || "Internal Server Error";
    let status = error.statusCode || HttpResponse.internalServerError;
    let data = error.detail || null;
    

    if(+error.code === 11000) {
        statusCode = 400;
        // logic 
        let msg = {};
        Object.keys(error.keyPattern).map((field) => {
            msg[field] = `${field} should be unique`
        })
        message = msg;
        status=  HttpResponse.validationFailed
    }

    res.status(statusCode)
    .json({
        data: data,
        message: message,
        status: status,
        options: null
    })
})
// export default application;
module.exports = application