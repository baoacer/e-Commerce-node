"use strict";
const ApiKeyModel = require('../models/apikey.model')
class ApikeyService{
    static findByKey = async (key) => {
        const objKey = await ApiKeyModel.findOne({key: key, status: true}).lean();
        return objKey
    }
}

module.exports = ApikeyService