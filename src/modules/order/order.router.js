const orderRouter = require("express").Router();
const { checkLogin } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/rbac.middleware");
const { bodyValidator } = require("../../middlewares/request-validator.middleware");
const orderCtrl = require("./order.controller");
const { AddToCartDTO, RemoveFromCartDTO, CheckoutDTO, TransactionDTO } = require("./order.request");


orderRouter.post("/add-to-cart", checkLogin, checkPermission(['customer', 'admin']), bodyValidator(AddToCartDTO), orderCtrl.addToCart);
orderRouter.get('/my-cart', checkLogin, checkPermission(['admin','customer']), orderCtrl.viewAllCartItems)
orderRouter.put('/remove-from-cart', checkLogin, checkPermission(['customer', 'admin']), bodyValidator(RemoveFromCartDTO), orderCtrl.removeFromCart)

orderRouter.post('/checkout', checkLogin, checkPermission(['customer','admin']), bodyValidator(CheckoutDTO), orderCtrl.checkout);
orderRouter.get("/all-list", checkLogin, orderCtrl.getMyOrders )
orderRouter.post("/:id/transaction", checkLogin, checkPermission(['customer','admin']), bodyValidator(TransactionDTO), orderCtrl.createTransaction)
module.exports = orderRouter