const Order = require('../../models/order.model')

class OrderRepository{

    static createOrder = async (payload) => {
        const { order_user_id, order_checkout, order_shipping, order_payment, order_products, order_tracking_number } = payload
        return await Order.create({
            order_user_id: order_user_id,
            order_checkout: order_checkout,
            order_shipping: order_shipping,
            order_payment: order_payment,
            order_products: order_products,
        })
    }

}

module.exports = OrderRepository