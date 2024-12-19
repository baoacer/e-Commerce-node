'use strict'
const Discount = require('../../models/discount.model')
const Utils = require('../../utils/index')

class DiscountRepository {

    static updateDiscount(codeId, payload, isNew = true){
        const discount = Discount.findByIdAndUpdate(codeId, payload, { new: isNew })
        return discount
    }

    static async deleteDiscount( filter ) {
        return await Discount.deleteOne(filter).lean()
    }

    static async findAllDiscountUnSelect({ 
        filter, limit = 50, page = 1, sort = 'ctime', unSelect
     }){
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const discounts = await Discount.find( filter )
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(Utils.unGetSelectData(unSelect))
        .lean()
        .exec()

        return discounts
    }

    static async findAllDiscountSelect({ 
        filter, limit = 50, page = 1, sort = 'ctime', select
     }){
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        const discounts = await Discount.find( filter )
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(Utils.getSelectData(select))
        .lean()
        .exec()

        return discounts
    }

    static async checkDiscountExists( filter ) {
        return await Discount.findOne(filter).lean()
    }
}

module.exports = DiscountRepository