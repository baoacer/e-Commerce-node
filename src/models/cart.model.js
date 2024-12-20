"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const CartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'pending', 'completed', 'failed'],
        default: 'active'
    },
    cart_products: {type: Array, require: true, default: []},
    cart_count_product: {type: Number, default: 0},
    cart_user_id: {type: Schema.Types.ObjectId, ref: "User"},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, CartSchema);

