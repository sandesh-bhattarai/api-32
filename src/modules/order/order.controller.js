const HttpResponseCode = require("../../constants/http-status-code.constant");
const HttpResponse = require("../../constants/response-status.constant");
const productSvc = require("../product/product.service");
const orderSvc = require("./order.service");

class OrderController {
    addToCart = async(req, res, next) => {
        try {
            const {productId, quantity} = req.body;
            const productDetail = await productSvc.getSingleProductByFilter({
                _id: productId,
                status: 'active'
            });

            // buyer 
            const buyer = req.loggedInUser;

            // existing cart
            const existingCart = await orderSvc.findSingleCartItemByFilter({
                buyerId: buyer._id,
                productId: productId,
                orderId: null
            })
            let cart = null;
            if(existingCart) {
                // update cart with quantity
                let qty = quantity + existingCart.quantity;
                const updateBody = {
                    amount: productDetail.actualAmt * qty,
                    quantity: qty
                }
                cart = await orderSvc.updateCartById(existingCart._id, updateBody)
                res.json({
                    detail: cart, 
                    message: "Cart Updated Successfully",
                    status: HttpResponse.cart.cart_update_success,
                    options: null
                })
            } else {
                // create cart 
                const cartItem = {
                    orderId: null,
                    productId: productId,
                    buyerId: buyer._id, 
                    quantity: quantity,
                    price: productDetail.actualAmt,
                    amount: productDetail.actualAmt * quantity,
                    status: "new",
                    seller: productDetail?.seller?._id
                }
                cart = await orderSvc.createCartItem(cartItem)
                res.json({
                    detail: cart,
                    message: "Product added in the cart",
                    status: HttpResponse.cart.create_cart_success,
                    options: null
                })
            }
        } catch(exception) {
            next(exception)
        }
    }

    viewAllCartItems = async(req, res, next) => {
        try {
            const loggedInuser = req.loggedInUser;
            let filter = {
                orderId: null
            }
            if(loggedInuser.role === 'customer') {
                filter = {
                    ...filter, 
                    buyerId: loggedInuser._id
                }
            }

            const allCartItems = await orderSvc.findCartByFilter(filter);
            res.json({
                detail: allCartItems,
                message: "All cart items",
                status: HttpResponse.cart.all_cart_list,
                options: null
            })
        } catch(exception) {
            next(exception);
        }
    }

    removeFromCart = async(req, res, next) => {
        try {
            const {cartId, quantity} = req.body;
            const cartItem = await orderSvc.findSingleCartItemByFilter({
                _id: cartId
            })
            if(!cartItem) {
                throw {status: 400, message: "Cart does not exists",code: HttpResponse.cart.cart_not_found}
            }
            // quantity <= 0 => remove from cart 
            // subs update
            if(quantity <= 0 || cartItem.quantity === quantity) {
                let removed = await orderSvc.removeCartbyFilter({_id: cartId})
                res.json({
                    detail: removed, 
                    message: "Cart Item removed",
                    status: HttpResponse.cart.remove_success,
                    options: null
                })
            } else {
                if(cartItem.quantity < quantity) {
                    throw {status: 400, message: "Quantity should be less or equal to current Quantity in cart",code: HttpResponse.cart.cart_not_found}
                }
                let updatebody = {
                    quantity: cartItem.quantity - quantity,
                    amount: cartItem.productId.actualAmt * (cartItem.quantity - quantity)
                }
                const updatedata = await orderSvc.updateCartById(cartItem._id, updatebody)
                res.json({
                    detail: updatedata, 
                    message: "Cart Item removed",
                    status: HttpResponse.cart.remove_success,
                    options: null
                })
            }
        } catch(exception) {
            next(exception)
        }
    }

    checkout = async(req, res, next) => {
        try {
            const {cartId, discount} = req.body;
            const cartDetails = await orderSvc.findCartByFilter({
                _id: {$in: cartId},
                orderId: null
            })
            // 
            if(!cartDetails || cartId.length !== cartDetails.length) {
                throw {
                    status: HttpResponseCode.BAD_REQUEST,
                    message: "Order has already been placed",
                    code: HttpResponse.cart.cart_not_found
                }
            }
            const loggedInUser = req.loggedInUser;

            let subtotal = 0;
            
            cartDetails.map((cart) => {
                subtotal += cart.productId.actualAmt * cart.quantity;
            })
            
            let tax = (subtotal - discount* 100) * 1.13;

            const orderData = {
                buyerId: loggedInUser._id, 
                subtotal: subtotal,
                discount: discount * 100, 
                tax: tax,
                serviceCharge: 100,
                total: (subtotal - (discount * 100) + 100 + tax ),
                orderDate: new Date(),
                status: 'new',
                createdBy: loggedInUser._id
            }
            const orderObj = await orderSvc.createOrder(orderData)
            
            const updateCartItems = [];
            // update cartItems 
            for(let cart of cartDetails) {
                cart.orderId =orderObj._id;
                cart.price = cart.productId.actualAmt;
                cart.amount = cart.productId.actualAmt * cart.quantity;
                cart.status = 'ordered';
                cart.updatedBy = loggedInUser._id;

                updateCartItems.push(cart.save())
            }

            await Promise.all(updateCartItems)
            // TODO: notify 
            res.json({
                detail: orderObj,
                message: "Your order has been placed",
                status: HttpResponse.cart.order_placed,
                options: null
            })
        } catch(exception) {
            next(exception);
        }
    }

    getMyOrders = async(req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;
            // 
            if(loggedInUser.role === 'admin') {
                // all the orders 
                const allOrders = await orderSvc.getAllOrders();    // pagination
                res.json({
                    detail: allOrders, 
                    message: "Your orders",
                    stauts: "YOUR_ORDERS",
                    options: null
                })
            } else if(loggedInUser.role === 'customer') {
                // can view their order only
                const allOrders = await orderSvc.getAllOrders({
                    buyerId: loggedInUser._id
                });    // pagination
                res.json({
                    detail: allOrders, 
                    message: "Your orders",
                    stauts: "YOUR_ORDERS",
                    options: null
                })
            } else if(loggedInUser.role === 'seller') {
                // can view his or her product only
                const allOrders = await orderSvc.findCartByFilter({
                    orderId: {$ne: null},
                    seller: loggedInUser._id
                })
                res.json({
                    detail: allOrders, 
                    message: "Your orders",
                    stauts: "YOUR_ORDERS",
                    options: null
                })
            }
        } catch(exception) {
            next(exception)
        }
    }

    createTransaction = async(req, res, next) => {
        try {
            const orderId = req.params.id;
            
            const data = req.body; 
            data.createdBy = req.loggedInUser._id;

            const transction = await orderSvc.createTransaction(orderId, data);
            res.json({
                detail: transction,
                message: "Your order has been Paid",
                status: "ORDER_PAID",
                options: null
            })
        } catch(exception) {
            next(exception)
        }
    }

}

const orderCtrl = new OrderController();
module.exports = orderCtrl;