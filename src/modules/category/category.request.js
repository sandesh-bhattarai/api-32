const Joi = require("joi");

const CategoryCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    parentId: Joi.string().allow(null, '').default(null),
    description: Joi.string().optional().default(null)
})


const CategoryUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    parentId: Joi.string().allow(null, '').default(null),
    description: Joi.string().optional().default(null)
}).unknown()

module.exports = {
    CategoryCreateDTO,
    CategoryUpdateDTO
}