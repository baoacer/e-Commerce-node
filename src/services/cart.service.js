'use strict'
const Cart = require('../models/cart.model')
const CartRepository = require('./repositories/cart.repo')
const ProductRepository = require('./repositories/product.repo')
const { NotFoundError } = require('../core/error.response')
const Utils = require('../utils')
const { product } = require('../models/product.model')

/*
   - add product to cart [user]
   - reduce product quantity [user]
   - increase product quantity [user]
   - get cart [user]
   - delete cart [user]
   - delete item [user]
 */
class CartService{
  
    static async addToCart({ user_id, product = {} }){

        const { product_id, product_quantity } = product

        // check exists 
        const userCart = await Cart.findOne({ cart_user_id: Utils.convertObjectId(user_id) })

        // check product exists
        const foundProduct = await ProductRepository.findProductSelect({
            productId: product_id,
            select: ['product_name', 'product_price', 'product_shop']
        })
        if(!foundProduct) throw new NotFoundError('Product Not Found')

        foundProduct.product_quantity = product_quantity
        
        // cart not exits 
        // create
        if(!userCart){
            return CartRepository.createCart({ userId: user_id, product: foundProduct })
        }

        // cart exists 
        // 1. cart exists but not product 
        if(!userCart.cart_products.length){
            userCart.cart_products = [foundProduct]
            return await userCart.save()
        }

        // 2. cart exists and have product -> update quantity
        return await CartRepository.updateUserCartQuantity({ userId: user_id, product: foundProduct })
    }

     
    // [reduce, increase] product quantity
    /*
      user_id
      shop_order_id: [
          {
              shop_id,
              cart_products: [
                  {
                    product_quantity,
                    product_price,
                    shop_id,
                    old_quantity,
                    product_id
                  }
              ],
              version
          }
      ]
     */
    static async addToCartV2({ user_id, shop_order_ids }){
        const { _id, product_quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        // check exists
        const foundProduct = await ProductRepository.findProductById(_id)
        if(!foundProduct) throw new NotFoundError('Product not found')

        // compare
        if(foundProduct.product_shop.toString() !== shop_order_ids[0].shop_id){
            throw new NotFoundError('Product To Not Belong To Shop')
        }

        if(product_quantity === 0){
            return await this.deleteUserCartItem({ userId: user_id, productId: _id })
        }

        return await CartRepository.updateUserCartQuantity({
            userId: user_id,
            product: {
                _id: _id,
                product_quantity: product_quantity - old_quantity
            }
        })
    }    

    static async deleteUserCartItem({ userId, productId }){
        return await CartRepository.deleteUserCartItem({ userId, productId })
    }

    static async getListUserCart({ userId }){
        return await CartRepository.findListUserCart({ userId })
    }
}   

module.exports = CartService