const CartRepository = require('./repositories/cart.repo')
const { NotFoundError, BadRequestError } = require('../core/error.response')
const ProductRepository = require('./repositories/product.repo')
const DiscountService = require('./discount.service')
const RedisService = require('./redis.service')
const OrderRepository = require('./repositories/order.repo')

class CheckoutService {

     /*
      cart_id,
      user_id,
      shop_order_ids: [
          {
            shop_id,
            shop_discount: []
            item_products: [
                {
                    product_quantity,
                    product_price,
                    shop_id,
                    old_quantity,
                    product_id
                }
            ]
          },
          {
            shop_id,
            shop_discount: []
            item_products: [
                {
                    product_quantity,
                    product_price,
                    shop_id,
                    old_quantity,
                    product_id
                }
            ]
          },
      ]
     */
    static async checkoutReview({ cart_id, user_id, shop_order_ids }){
        // check cart exists
        const foundCart = await CartRepository.findCartById({ cartId: cart_id })
        if(!foundCart) throw new NotFoundError('Cart Not Found')

        const checkout_order = {
            totalPrice: 0,
            freeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shop_id, item_products = [], shop_discounts = [] } = shop_order_ids[i]  
            
            const checkProductServer = await ProductRepository.checkProductByServer(item_products)
            if(!checkProductServer[0]) throw new BadRequestError('Order Wrong')
            
            // Tinh tong tien cua tung san pham
            const checkoutPrice = checkProductServer.reduce((total, product) => {
                return total + (product.product_price * product.product_quantity)
            }, 0)

            // Tong tien truoc khi ap dung discount
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shop_id,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // if have discount 
            if(shop_discounts.length > 0){
                const { discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].discount_code,
                    userId: user_id,
                    shopId: shop_id,
                    products: checkProductServer
                })
                checkout_order.totalDiscount += discount
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // total price final
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids, cart_id, user_id,
        user_address = {}, user_payment = {}
    }){
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({ cart_id, user_id, shop_order_ids })

        /**
         * pessimistic locking (Khoa bi quan) : Khóa tài nguyên để đảm bảo tính toàn vẹn
         * khi có nhiều request (ví dụ bán hàng 1đ) 
         * x : mysql, sql -> tăng ram
         * v : sử dụng redis (nhanh hon mysql, sql...) (xử lý sigle thread) 
         * tool test: apache bench
         * ab -n -c url: 
         * -n: so request
         * -c: so request cung 1 thoi diem
         */
         // flatMap : Lay cac phan tu sau do gop lai thanh 1 mang phang
        const products = shop_order_ids_new.flatMap(order => order.item_products) 
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { product_id, product_quantity } = products[i]

            //If have key -> permisstion acquire
            const keyLock = await RedisService.acquireLock(product_id, product_quantity, cart_id)
            acquireProduct.push(keyLock ? true : false)
            
            if(keyLock){
                await RedisService.releaseKey(keyLock)
            }
        }

        // Check if have product out of stock
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Some product has been update, pls return Cart!')
        }

        // Todo:
        const newOrder = OrderRepository.createOrder({
            order_user_id: user_id,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        return newOrder
    }

     // query order [User]
     static async getOrderByUser(){
     }

     // get one order [User]
     static async getOneOrderByUser(){
    }

    // cancel order [User]
    static async cancelOrderByUser(){
    }

    // update order [Shop | Admin]
    static async updateOrderStatusByShop(){
    }
}

module.exports = CheckoutService