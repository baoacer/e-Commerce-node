const CartService = require("../services/cart.service")
const { SuccessResponse } = require("../core/success.response")

class CartController{

    /**
     * @desc Add product to cart for user
     * @param {String} userId 
     * @param {Object} product 
     * @method POST
     * @url /v1/api/cart
     * @returns {JSON}
     */
    static addToCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Add Product To Cart Success",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    } 

   /**
     * @desc update + -
     * @param {String} userId 
     * @param {Object} product 
     * @method POST
     * @url /v1/api/cart
     * @returns {JSON}
     */
    static update = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Update Quantity Product Success!",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

     /**
     * @desc delete
     * @param {String} userId 
     * @param {Object} product 
     * @method POST
     * @url /v1/api/cart
     * @returns {JSON}
     */
     static delete = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Delete Cart Item Success!",
            metadata: await CartService.deleteUserCartItem(req.body)
        }).send(res)
    }

    /**
     * @desc Get list user cart
     * @param {String} userId 
     * @method GET
     * @url /v1/api/cart
     * @returns {JSON}
     */
    static getListUserCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Get List User Cart Success!",
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = CartController