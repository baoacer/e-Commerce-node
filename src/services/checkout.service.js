const CartRepository = require('./repositories/cart.repo')
const { NotFoundError, BadRequestError } = require('../core/error.response')
const ProductRepository = require('./repositories/product.repo')
const DiscountService = require('./discount.service')

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
}

module.exports = CheckoutService