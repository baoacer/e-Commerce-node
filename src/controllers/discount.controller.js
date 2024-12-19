const DiscountService = require('../services/discount.service')
const {SuccessResponse} = require('../core/success.response')

class DiscountController {

    static getAllDiscountByShop = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get All Discount Success!",
            metadata: await DiscountService.findAllDiscountByShop({
               ...req.query
            })
        }).send(res)
    }

    static getAllDiscountWithProduct = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get All Discount With Product Success!",
            metadata: await DiscountService.findAllDiscountCodeWithProduct(req.query)
        }).send(res)
    }

    static updateDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get All Discount With Product Success!",
            metadata: await DiscountService.updateDiscount(req.params.code , {
                ...req.body,
                discount_shop_id: req.key.shop
            })
        }).send(res)
    }

    static getDiscountAmount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get Discount Amount Success!",
            metadata: await DiscountService.getDiscountAmount(req.body)
        }).send(res)
    }

    static cancelDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Cancel Discount Success!",
            metadata: await DiscountService.cancelDiscount(req.body)
        }).send(res)
    }

    static deleteDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Delete Discount Success!",
            metadata: await DiscountService.deleteDiscount({
                code: req.body.code,
                shopId: req.key.shop
            })
        }).send(res)
    }

    static createDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Create Discount Success!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                discount_shop_id: req.key.shop
            })
        }).send(res)
    }
}

module.exports = DiscountController