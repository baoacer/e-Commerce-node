'use strict'

const { product } = require('../../models/product.model')
const Utils = require('../../utils/index')

class ProductRepository {

    static findProduct = async ({ productId, unSelect }) => {
        return await product.findById( productId )
        .select(Utils.unGetSelectData(unSelect))
        .lean()
        .exec()
    }

    static findAllProducts = async ({ filter, limit, page, sort, select }) => {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)   
        .select(Utils.getSelectData(select))
        .lean()
        .exec()

        return products
    }

    static searchProductByUser = async ({ keySearch }) => {
        const regexSearch = new RegExp(keySearch)
        const results = await product.find({
            isPublished: true,
            $text: { $search: regexSearch }
        }, 
        { score: { $meta: "textScore" }})
        .sort({ score: { $meta: "textScore" }})
        return results
    }

    /**
     * @param {query} - query filter
     * @param {limit} - so luong ket qua tra ve
     * @param {skip} - so luong can bo qua truoc khi lay ket qua 
     * @returns 
     */
    static findAllDraftsForShop = async ({ query, limit, skip }) => {
        return await this.queryProduct({ query, limit, skip })
    }

    // publish //
    static findAllPublishsForShop = async ({ query, limit, skip }) => {
        return await this.queryProduct({ query, limit, skip })
    }

    static unPublishProductByShop = async ({ shopId, productId }) => {
        const foundShop = await product.findOne({ 
            _id: productId,
            product_shop: shopId
        })
        if(!foundShop) return null

        foundShop.isDraft = true
        foundShop.isPublished = false

        const { modifiedCount } = await foundShop.updateOne(foundShop)
        return modifiedCount
    }

    static publishProductByShop = async ({ shopId, productId }) => {
        const foundShop = await product.findOne({ 
            _id: productId,
            product_shop: shopId
        })
        if(!foundShop) return null

        foundShop.isDraft = false
        foundShop.isPublished = true

        const { modifiedCount } = await foundShop.updateOne(foundShop)
        return modifiedCount
    }

    static queryProduct = async ({ query, limit, skip }) => {
        return await product.find(query).
        populate('product_shop', 'name email -_id')  
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
    }
}

module.exports = ProductRepository