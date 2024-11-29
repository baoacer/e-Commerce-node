'use strict'

const _ = require('lodash')

class Utils {
    static getInfoData = ({ field = [], object = {} }) => {
        return _.pick(object, field)
    }
}

module.exports = Utils