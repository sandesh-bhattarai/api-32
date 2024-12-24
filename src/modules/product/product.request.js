const Joi = require("joi");

const ProductCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    category: Joi.string().required(),
    brand: Joi.string().allow(null, '').optional().default(null),
    price: Joi.number().min(100).required(),
    discount: Joi.number().min(0).max(100).default(0),
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null),
    seller: Joi.string().allow(null, '').optional().default(null)
}).unknown()


const ProductUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    category: Joi.string().required(),
    brand: Joi.string().allow(null, '').optional().default(null),
    price: Joi.number().min(100).required(),
    discount: Joi.number().min(0).max(100).default(0),
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null),
    seller: Joi.string().allow(null, '').optional().default(null)
}).unknown()

module.exports = {
    ProductCreateDTO,
    ProductUpdateDTO
}