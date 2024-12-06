'use strict'
const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    static createProduct = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Create Product Success!",
            metadata: await ProductService.createProduct({
                type: req.body.product_type,
                payload: {
                    ...req.body,
                    product_shop: req.key.shop 
                }
            })
        }).send(res)
    }
}

module.exports = ProductController