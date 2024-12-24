const Joi = require("joi");

const BannerCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    link: Joi.string().uri().default(null), 
    startDate: Joi.date().required(), 
    endDate: Joi.date().min(Joi.ref("startDate")).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null)
    // image: Joi.object().required()
})


const BannerUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(), 
    link: Joi.string().uri().default(null), 
    startDate: Joi.date().required(), 
    endDate: Joi.date().min(Joi.ref("startDate")).required(), 
    status: Joi.string().regex(/^(active|inactive)$/).default("inactive"), 
    description: Joi.string().optional().default(null)
}).unknown()

module.exports = {
    BannerCreateDTO,
    BannerUpdateDTO
}