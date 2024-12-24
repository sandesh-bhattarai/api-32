const HttpResponse = require("../../constants/response-status.constant");
const CartModel = require("./order-detail.model");
const OrderModel = require("./order.model");
const TransactionModel = require("./transaction.model");

class OrderService {
    findCartByFilter = async(filter) => {
        try {
            const data = await CartModel.find(filter)
                    .populate("productId", ["_id",'title','slug','images','price','actualAmt','discount'])
                    .populate("buyerId", ['_id','name','email','phone','role','address'])
                    .populate("seller", ['_id','name','email','phone','role','address'])
            return data;
        } catch(exception) {
            console.log("findCartByFilter", exception);
            throw exception;
        }
    }

    findSingleCartItemByFilter = async(filter) => {
        try {
            const data = await CartModel.findOne(filter)
                    .populate("productId", ["_id",'title','slug','images','price','actualAmt','discount'])
                    .populate("buyerId", ['_id','name','email','phone','role','address'])
                    .populate("seller", ['_id','name','email','phone','role','address'])
            return data;
        } catch(exception) {
            console.log("findSingleCartItemByFilter", exception);
            throw exception
        }
    }

    createCartItem = async(cartItem) => {
        try {
            const cart = new CartModel(cartItem);
            return await cart.save()
        } catch(exception) {
            console.log("createCartItem", exception)
            throw exception;
        }
    }

    updateCartById =  async(id, data) => {
        try {
            const update = await CartModel.findByIdAndUpdate(id, {$set: data}, {new: true});
            return update;
        } catch(exception) {
            console.log("updateCartById", exception)
            throw exception;
        }
    }

    removeCartbyFilter = async(filter) => {
        try {
            const del = await CartModel.findOneAndDelete(filter);
            if(!del) {
                throw {status: 400, message: "Cart does not exists anymore", code: HttpResponse.cart.cart_not_found}
            }
            return del
        }catch(exception) {
            console.log("removeCartByFilter", exception);
            throw exception;
        }
    }

    createOrder = async (orderData) => {
        try {
            const order = new OrderModel(orderData);
            return await order.save();
        } catch(exception) {
            console.log("createOrder", exception)
            throw exception;
        }
    }

    getAllOrders = async(filter) => {
        try {
            const data = await OrderModel.aggregate([
                {
                  '$match': {
                    filter
                  }
                }, {
                  '$lookup': {
                    'from': 'carts', 
                    'localField': '_id', 
                    'foreignField': 'orderId', 
                    'as': 'detail'
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'buyerId', 
                    'foreignField': '_id', 
                    'as': 'buyer'
                  }
                }, {
                  '$unwind': {
                    'path': '$buyer', 
                    'preserveNullAndEmptyArrays': true
                  }
                }
              ])
            return data;
        } catch(exception) {
            console.log("getAllOrders", exception);
            throw exception
        }
    }

    createTransaction = async(orderId, transactionData) => {
        try {
            if(transactionData.paymentMethods === 'cash' || transactionData.paymentMethods === 'other') {
                transactionData.transactionCode = Date.now()        // timestamp
            }
            transactionData.transactionDate =  new Date()
            transactionData.status = 'paid'
            const transaction = new TransactionModel(transactionData)
            return await transaction.save()


        } catch(exception) {
            throw exception
        }
    }
}

const orderSvc = new OrderService()
module.exports = orderSvc;