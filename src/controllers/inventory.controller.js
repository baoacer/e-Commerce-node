const InventoryService = require("../services/inventory.service")
const { SuccessResponse } = require("../core/success.response")

class InventoryController{

    static async addStockToInventory(req, res, next){
        new SuccessResponse({
            message: "Add Stock To Inventory Success!",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
            
}

module.exports = InventoryController