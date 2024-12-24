const Joi = require("joi");

const BrandCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null)
})


const BrandUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null)
}).unknown()

module.exports = {
    BrandCreateDTO,
    BrandUpdateDTO
}