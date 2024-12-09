'use strict'

const _ = require('lodash')

class Utils {
    static getInfoData = ({ field = [], object = {} }) => {
        return _.pick(object, field)
    }

    static getSelectData = ( select = []) => {
        return Object.fromEntries(select.map(el => [el, 1]))
    }

    static unGetSelectData = ( select = []) => {
        return Object.fromEntries(select.map(el => [el, 0]))
    }
}

module.exports = Utils