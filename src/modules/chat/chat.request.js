const Joi = require("joi");

const ChatCreateDTO = Joi.object({
    message: Joi.string().required(),
    receiver: Joi.string().required()
})

module.exports = {
    ChatCreateDTO
}