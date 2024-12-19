"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const DiscountSchema = new Schema({
    discount_code: {type: String, required: true, unique: true},
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},   
    discount_type: {type: String, enum:['fixed', 'percentage'], default: 'fixed'},
    discount_code_value: {type: Number, required: true},
    discount_min_order_value: {type: Number, required: true}, // gia tri toi thieu de ap dung discount
    discount_start_time: {type: Date, required: true},
    discount_end_time: {type: Date, required: true},
    discount_total_use_limit: {type: Number, required: true}, // so lan discount dc su dung
    discount_user_use_limit: {type: Number, required: true}, // so lan user dc su dung 
    discount_used_count: {type: Number, require: true}, // tong so discount da dc su dung
    discount_user_used: {type: Array, default: []}, // user da su dung
    discount_shop_id: {type: Schema.Types.ObjectId, required: true, ref: "Shop"},
    discount_products_id: {type: Array, default: []}, // san pham duoc ap dung
    discount_applies_to: {type: String, enum: ['all', 'specific'], default: 'all'}, // all or specific
    discount_visibility: {type: Boolean, default: true}, // hien thi
    discount_is_active: {type: Boolean, default: true},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, DiscountSchema);

