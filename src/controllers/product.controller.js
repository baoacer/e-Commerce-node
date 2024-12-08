'use strict'
const ProductFactory = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    /**
     * @desc Create Product
     * @param {String} type - type of product 
     * @param {Object} payload - product data
     * @returns {JSON} 
     */
    static createProduct = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Create Product Success!",
            metadata: await ProductFactory.createProduct({
                type: req.body.product_type,
                payload: {
                    ...req.body,
                    product_shop: req.key.shop 
                }
            })
        }).send(res)
    }

    // =============== query ================

    /**
     * @desc Get all draft for shop
     * @param {String} product_shop 
     * @param {Number} limit 
     * @param {Number} skip
     * @returns {JSON} 
     */
    static getAllDraftsForShop = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get List Draft Success!",
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.key.shop
            })
        }).send(res)
    }    

    // =============== end query ================
}

module.exports = ProductController