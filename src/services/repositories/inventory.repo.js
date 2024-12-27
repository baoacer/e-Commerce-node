const Inventory = require("../../models/inventory.model")
const Utils = require("../../utils")

class InventoryRepository {
    
    static insertInventory = async ({ productId, shopId, quantity, location = "unknown" }) => {
        return await Inventory.create({
            inven_product_id: productId,
            inven_location: location,
            inven_quantity: quantity,
            inven_shop_id: shopId
        })
    }

    static addStockToInventory = async ({ 
        stock, productId, shopId, location
     }) => {
        const query = {
            inven_product_id: Utils.convertObjectId(productId),
            inven_shop_id: Utils.convertObjectId(shopId)
        }
        const updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }
        const options = { upsert: true, new: true }

        return await Inventory.findOneAndUpdate(query, updateSet, options).lean()
    }

    static reservationInventory = async ({ productId, quantity, cartId }) => {
        const query = {
            inven_product_id: Utils.convertObjectId(productId),
            inven_stock: { $gte: quantity } // Greater Than or Equal (>=)
        }
        const updateSet = {
            $inc: {
                inven_stock: -quantity
            },
            $push: {
                inven_reservations: {
                    cart_id: cartId,
                    quantity,
                    createdAt: new Date()
                }
            }
        }

        return await Inventory.updateOne(query, updateSet)
    }
}

module.exports = InventoryRepository