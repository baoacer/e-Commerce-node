'use strict'
const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture } = require('../models/product.model');
const ProductRepository = require('./repositories/product.repo');


class ProductFactory {

    static productRegistry = {};

    static registerProductType(type, productClass){
        ProductFactory.productRegistry[type] = productClass
    }

    static async createProduct({ type, payload }){
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid Product Type::${type}`);
        return new productClass(payload).createProduct();
    }

    // put //
    static async publishProductByShop({ shopId, productId }){
        return await ProductRepository.publishProductByShop({ shopId, productId })
    }

    static async unPublishProductByShop({ shopId, productId }){
        return await ProductRepository.unPublishProductByShop({ shopId, productId })
    }

    // query //
    static async searchProducts({ keySearch }){
        return await ProductRepository.searchProductByUser({ keySearch })   
    }

    static async findAllPublishsForShop({ shopId, limit = 50, skip = 0 }){
        return await ProductRepository.findAllPublishsForShop({ 
            query: { product_shop: shopId, isPublished: true },
            limit: limit,
            skip: skip
         })
    }

    static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }){
        return await ProductRepository.findAllDraftsForShop({ 
            query: { product_shop: shopId, isDraft: true },
            limit: limit,
            skip: skip
         })
    }
}       

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes; 
    }

    // create new product
    async createProduct(product_id){
        return await product.create({...this, _id: product_id});
    }
}

class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newClothing) throw new BadRequestError('Create new clothing Error');

        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('Create new product Error');

        return newProduct;
    }
}

class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronic) throw new BadRequestError('Create new electronic Error');

        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError('Create new product Error');

        return newProduct;
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newFurniture) throw new BadRequestError('Create new furniture Error');

        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) throw new BadRequestError('Create new product Error');

        return newProduct;
    }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory
