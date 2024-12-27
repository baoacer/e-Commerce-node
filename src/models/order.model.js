"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderSchema = new Schema({
    order_user_id: {type: Schema.Types.ObjectId, ref: "User"},
    order_checkout: {type: Object, default: {}}, // checkout_order - checkout service
    order_shipping: {type: Object, default: {}},    
    order_payment: {type: Object, default: {}},  
    order_products: {type: Array, require: true}, // shop_order_ids_new - checkout service
    order_tracking_number: {type: String, require: true},
    order_status: {type: String, enum: ['pending', 'comfirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, OrderSchema)


