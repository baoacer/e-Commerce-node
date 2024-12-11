"use strict";

const { Schema, model, Types } = require("mongoose");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const InventorySchema = new Schema({
    inven_productId: {type: Schema.Types.ObjectId, ref: "Product"},
    inven_location: {type: String, default: 'unknown'},
    inven_quantity: {type: Number, required: true},
    inven_shopId: {type: Schema.Types.ObjectId, ref: "Shop"},
    inven_reservations: {type: Array, default: []},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ApiKeySchema);

