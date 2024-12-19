const { filter } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const Discount = require('../models/discount.model')
const Utils = require("../utils")
const DiscountRepository = require("./repositories/discount.repo")
const ProductRepository = require('./repositories/product.repo')

class DiscountService{

    static async findAllDiscountByShop({ shopId, limit, page }){
        const discounts = await DiscountRepository.findAllDiscountUnSelect({
            filter: {
                discount_shop_id: Utils.convertObjectId(shopId),
                discount_is_active: true
            },
            limit: +limit,
            page: +page,
            select: ['__v', 'discount_visibility', 'discount_shop_id']
        })

        return discounts
    }

    static async findAllDiscountCodeWithProduct({
        code, shopId, limit, page
    }){
        const foundDiscount = await DiscountRepository.checkDiscountExists({
            discount_code: code,
            discount_shop_id: Utils.convertObjectId(shopId)
        })

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new BadRequestError("Discount Code Not Exists")
        }

        const { discount_products_id, discount_applies_to } = foundDiscount
        let products
        if(discount_applies_to === 'specific'){
            products = await ProductRepository.findAllProducts({
                filter: {
                    _id: {$in: discount_products_id},
                    isPublished: true 
                },  
                limit: +limit, // '+' convert string to number
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'all'){
            products = await ProductRepository.findAllProducts({
                filter: {
                    product_shop: Utils.convertObjectId(shopId),
                    isPublished: true 
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    static async createDiscountCode( payload ){
        const {
            discount_code, discount_name, discount_description, discount_type, 
            discount_code_value, discount_min_order_value, discount_start_time,
            discount_end_time, discount_total_use_limit, discount_user_use_limit,
            discount_used_count, discount_user_used, discount_shop_id,
            discount_products_id, discount_applies_to = 'all', discount_visibility = true,
            discount_is_active = true
        } = payload

        if(new Date(discount_start_time) < new Date() || new Date(discount_end_time) < new Date(discount_start_time)){
            throw new BadRequestError("Discount Code Has Expired")
        } 

        if (discount_applies_to === "specific" && discount_products_id.length === 0) {
            throw new BadRequestError("Products must be specified when discount applies to specific items")
        }

        const foundDiscount = await DiscountRepository.checkDiscountExists({
            discount_code: discount_code,
            discount_shop_id: discount_shop_id
        })  

        if(foundDiscount && foundDiscount.discount_is_active){  
            throw new BadRequestError("Discount Code Already Exists")
        }

        const newDiscount = await Discount.create({
            discount_code: discount_code,
            discount_name: discount_name,
            discount_description: discount_description,
            discount_type: discount_type,
            discount_code_value: discount_code_value,
            discount_min_order_value: discount_min_order_value || 0,
            discount_start_time: new Date(discount_start_time),
            discount_end_time: new Date(discount_end_time),
            discount_total_use_limit: discount_total_use_limit,
            discount_user_use_limit: discount_user_use_limit,
            discount_used_count: discount_used_count,
            discount_user_used: discount_user_used,
            discount_shop_id: Utils.convertObjectId(discount_shop_id),
            discount_products_id: discount_applies_to === 'all' ? [] : discount_products_id,
            discount_applies_to: discount_applies_to,
            discount_visibility: discount_visibility,
            discount_is_active: discount_is_active
        })

        return newDiscount
    }

    static async updateDiscount(code ,payload){
        const {
            discount_code, discount_name, discount_description, discount_type, 
            discount_code_value, discount_min_order_value, discount_start_time,
            discount_end_time, discount_total_use_limit, discount_user_use_limit,
            discount_used_count, discount_user_used, discount_shop_id,
            discount_products_id, discount_applies_to = 'all', discount_visibility = true,
            discount_is_active = true
        } = payload

        const objectParams = Utils.updateNestedObjectParser(payload)

        const foundDiscount = await DiscountRepository.checkDiscountExists({
            discount_code: code,
            discount_shop_id: Utils.convertObjectId(discount_shop_id)
        })

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new BadRequestError("Discount Code Not Exists")
        }

        if (discount_start_time || discount_end_time) {
            const now = new Date();
            const startTime = discount_start_time ? new Date(discount_start_time) : foundDiscount.discount_start_time;
            const endTime = discount_end_time ? new Date(discount_end_time) : foundDiscount.discount_end_time;

            if (startTime < now || endTime <= startTime) {
                throw new BadRequestError("Invalid discount start or end time");
            }
        }

        const updateDiscount = DiscountRepository.updateDiscount(foundDiscount._id, objectParams)

        return updateDiscount
    }

   

    /**
     * @desc Get discount amount in cart
     * @param {Array} products - list of products in cart 
     */
    static async getDiscountAmount({
        code, userId, shopId, products
    }){
        // check discount exists
        const foundDiscount = await DiscountRepository.checkDiscountExists({
            discount_code: code,
            discount_shop_id: Utils.convertObjectId(shopId)
        })

        if(!foundDiscount) throw new NotFoundError("Discount Code Not Exists")

        const { discount_is_active, discount_total_use_limit, discount_start_time,
            discount_end_time, discount_min_order_value, discount_user_use_limit,
            discount_user_used, discount_type, discount_code_value
        } = foundDiscount

        if(!discount_is_active) throw new BadRequestError("Discount Code Has Expired")
        if(discount_total_use_limit <= 0) throw new BadRequestError("Discount are out")
        if(new Date(discount_start_time) < new Date() || new Date(discount_end_time) < new Date(discount_start_time)) throw new BadRequestError("Discount Code Has Expired")
        
        // check order value
        let totalOrder = 0
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((total, product) => {
                return total + (product.product_price * product.product_quantity)
            }, 0)

            if(totalOrder < discount_min_order_value){
                throw BadRequestError(`Discount Requires A Minimun Order Value Of ${discount_min_order_value}`)
            }
        }

        // check user used
        if(discount_user_use_limit > 0){
            const userUseDiscount = discount_user_used.find(user => user === userId)
            if(userUseDiscount) throw new BadRequestError("You Have Already Used This Discount Code")
            await Discount.updateOne(
                { 
                    _id: foundDiscount._id, 
                    discount_user_used: { $ne: userId }, // Chỉ cập nhật nếu user chưa tồn tại
                    discount_user_use_limit: { $gt: 0 },
                    discount_total_use_limit: { $gt: 0 }
                },
                {   
                    $push: { discount_user_used: userId },
                    $inc: { 
                        discount_used_count: 1,
                        discount_total_use_limit: -1 
                    }
                }
            )                
        } 

        // get amount
        const amount = discount_type === 'fixed' ? discount_code_value : totalOrder *  (discount_code_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({ code, shopId}){
        const foundDiscount = DiscountRepository.checkDiscountExists({
            discount_code: code,
            discount_shop_id: Utils.convertObjectId(shopId)
        })

        if(foundDiscount){
            await DiscountRepository.deleteDiscount({
                discount_code: foundDiscount._id
            })
        }
    }

    static async cancelDiscount({ code, shopId, userId }){
        const foundDiscount = DiscountRepository.checkDiscountExists({
            discount_code: code,
            discount_shop_id: Utils.convertObjectId(shopId)
        })

        if(!foundDiscount) throw new NotFoundError("Discount Code Not Exists")

        const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
            // loai bo phan tu khoi mang
            $pull: {
                discount_user_used: userId
            },
            // tang, giam gia tri cua field
            $inc: {
                discount_total_use_limit: 1,
                discount_used_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService