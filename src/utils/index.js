'use strict'

const _ = require('lodash')
const mongoose = require('mongoose')

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

    static removeUndefinedObject = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key]
            } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                obj[key] = this.removeUndefinedObject(obj[key]) 
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key]
                }
            }
        });
        return obj
    };
    
    static updateNestedObjectParser = obj => {
        const final = {}
        Object.keys(obj).forEach(k => {
            if(typeof obj[k] === 'object' && !Array.isArray() && k !== 'product_shop'){
                const response = this.updateNestedObjectParser(obj[k])
                Object.keys(response).forEach( a => {
                    final[`${k}.${a}`] = response[a]
                })
            }else {
                final[k] = obj[k]
            }
        })
        return final
    };
}

module.exports = Utils