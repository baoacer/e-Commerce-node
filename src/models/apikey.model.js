"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

const ApiKeySchema = new Schema({
    key: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true},
    permissions: {type: [String], enum: ['0', '1', '2']},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ApiKeySchema);

