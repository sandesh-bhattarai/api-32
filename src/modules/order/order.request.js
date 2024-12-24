const Joi = require("joi");

const AddToCartDTO = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required()
});

const RemoveFromCartDTO = Joi.object({
    cartId: Joi.string().required(),
    quantity: Joi.number().min(0).required()
});

const CheckoutDTO = Joi.object({
    cartId: Joi.array().items(Joi.string().required()).required(),
    discount: Joi.number().min(0).allow(null, '', 0).default(0)
})

const TransactionDTO = Joi.object({
    amount: Joi.number().min(1).required(),
    transactionCode: Joi.string().allow(null, '').default(null),
    paymentMethods: Joi.string().regex(/^(cash|esewa|khalti|bank|connectips|other)$/).default('cash'),
    response:Joi.any()
}).unknown()

module.exports = {
    AddToCartDTO,
    RemoveFromCartDTO,
    CheckoutDTO,
    TransactionDTO
}