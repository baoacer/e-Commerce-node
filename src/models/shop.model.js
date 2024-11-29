"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

const ShopSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, trim: true, required: true},
    password: {type: String, required: true},
    status: {type: String, enum: ["active", "inactive"], default: "inactive"},
    verfify: {type: Boolean, default: false},
    roles: {type: Array, default: []},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ShopSchema);
