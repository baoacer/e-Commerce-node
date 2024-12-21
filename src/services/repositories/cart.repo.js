const Cart = require("../../models/cart.model")
const Utils = require("../../utils")

class CartRepository {

    static async findCartById({ cartId }){
        return Cart.findOne({ _id: Utils.convertObjectId(cartId), cart_state: 'active'}).lean()
    }

    static async findListUserCart({ userId }){
        return Cart.findOne({ cart_user_id: userId }).lean()
    }

    static async deleteUserCartItem({ userId, productId }){
        const query = {
            cart_user_id: Utils.convertObjectId(userId),
            cart_state: 'active'
        }

        const updateSet = {
            $pull: {
                cart_products: {
                    _id: Utils.convertObjectId(productId)
                }
            }
        }

        const deleteCart = await Cart.updateOne(query, updateSet).lean()
        return deleteCart
    }

    static async createCart({ userId, product }){
        // find
        const query = {
            cart_user_id: Utils.convertObjectId(userId),
            cart_state: 'active'
        }
        const updateOrInsert = {
            // add new item if not exist
            $addToSet: { 
                cart_products: product
            }
        }
        // upsert: if query not found -> create new document with updateOrInsert
        // new: return new document
        const options = { upsert: true, new: true }

        return await Cart.findOneAndUpdate(query, updateOrInsert, options).lean()
    }

    static async updateUserCartQuantity({ userId, product }){
        const { _id, product_quantity } = product

        const cart = await Cart.findOne({
            cart_user_id: Utils.convertObjectId(userId),
            cart_state: 'active',
            "cart_products._id": Utils.convertObjectId(_id)
        })

        if(!cart) throw new NotFoundError('Product Not Found')

        const updateSet = {
            // $inc : tang, giam
            $inc: {
                // if quantity > 0 -> increase, else reduce
                // $ : dai dien product dau tien khop voi dieu kien query 
                "cart_products.$.product_quantity": product_quantity
            }
        };
    
        const options = { new: true };
        return await Cart.findOneAndUpdate(
            {
                cart_user_id: Utils.convertObjectId(userId),
                cart_state: 'active',
                "cart_products._id": Utils.convertObjectId(_id)
            },
            updateSet,
            options
        ).lean()
    }
}

module.exports = CartRepository