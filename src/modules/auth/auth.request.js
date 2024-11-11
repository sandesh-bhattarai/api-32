const Joi = require("joi");

const userRegistrationDTO = Joi.object({
    fullName: Joi.string().regex(/^[A-Za-z]+(?:\s[A-Za-z]+){1,2}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&+-])(?=.*[\d])[A-Za-z\d!@#$%^&+-]{8,25}$/).required(),
    passwordConfirmation: Joi.string().equal(Joi.ref('password')).required(),
    address: Joi.string().optional().empty(null, ''),
    gender: Joi.string().regex(/^(male|female|other)$/).optional(),
    telephone: Joi.string().regex(/^(?:\+977[- ]?)?(?:98[4-9]|97[4-9]|96[0-9]|01\d{1})[- ]?\d{6,7}$/).optional(),
    role:  Joi.string().regex(/^(customer|seller)$/).default('customer'),
})

const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const activationDTO = Joi.object({
    otp: Joi.string().max(6).min(6),
    email: Joi.string().email().required()
})

const resendOtpDTO = Joi.object({
    email: Joi.string().email().required(),
})

module.exports= {
    userRegistrationDTO,
    loginDTO,
    activationDTO,
    resendOtpDTO
}