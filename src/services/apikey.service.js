"use strict";
const ApiKeyModel = require('../models/apikey.model')
const crypto = require('crypto')
class ApikeyService{
    static findById = async (key) => {
        const objKey = await ApiKeyModel.findOne({key: key, status: true}).lean();
        return objKey
    }
}

module.exports = ApikeyService