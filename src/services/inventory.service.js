const InventoryRepository = require("./repositories/inventory.repo")

class InventoryService{

    static async addStockToInventory({
        stock, productId, shopId, location = 'HCM city'
    }){
        return await InventoryRepository.addStockToInventory({
            stock, productId, shopId, location
        })
    }

}

module.exports = InventoryService