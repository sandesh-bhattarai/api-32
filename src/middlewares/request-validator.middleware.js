const HttpResponseCode = require("../constants/http-status-code.constant");
const HttpResponse = require("../constants/response-status.constant");

const bodyValidator = (schemaDto) => {
    // flexibi
    return async (req, res, next) => {
       try {
            let data = req.body;
            
            // validate your data 
            const validatedData = await schemaDto.validateAsync(data, {
                abortEarly: false
            })
            next()  // next middleware
       } catch(exception) {
            let msg = {}
            
            // exception.details 
            console.log(exception)
            exception.details.map((error) => {
                
                msg[error.context.label] = error.message
            })
            next({detail: msg, statusCode: HttpResponse.validationFailed, message: "Validation Failed", status: HttpResponseCode.BAD_REQUEST})
       }

    }
}

module.exports = {
    bodyValidator
}