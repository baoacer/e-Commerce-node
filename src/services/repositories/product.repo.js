'use strict'

const { product, clothing, electronic, furniture } = require('../../models/product.model')

class ProductRepository {
    /**
     * @param {query} - query filter
     * @param {limit} - so luong ket qua tra ve
     * @param {skip} - so luong can bo qua truoc khi lay ket qua 
     * @returns 
     */
    static findAllDraftsForShop = async ({ query, limit, skip }) => {
        return await product.find(query).
        populate('product_shop', 'name email -_id') // - ref: product_shop 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
    }
}

module.exports = ProductRepository