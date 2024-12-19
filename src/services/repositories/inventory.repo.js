const Inventory = require("../../models/inventory.model")

class InventoryRepository {
    static insertInventory = async ({ productId, shopId, quantity, location = "unknown" }) => {
        return await Inventory.create({
            inven_productId: productId,
            inven_location: location,
            inven_quantity: quantity,
            inven_shopId: shopId
        })
    }
}

module.exports = InventoryRepository