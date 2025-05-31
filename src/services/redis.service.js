'use strict'

const redis = require('redis')
const InventoryRepository = require('./repositories/inventory.repo')

const { getRedis } = require('../databases/init.redis')
const { instanceRedis: redisClient } = getRedis() 

class RedisService {

    /**
     * @desc sử dụng Redis để tạo cơ chế khóa phân tán (distributed locking) 
     * @param {Number} retryTimes - so lan thu lai neu khoa bi nguoi khac giu
     * @param {Number} expireTime - tgian ton tai cua khoa
     * @returns 
     */
    static acquireLock = async (productId, quantity, cartId) => {
        const key = `lock_v2024_${productId}`
        const retryTimes = 10 
        const expireTime = 3000 

        for (let i = 0; i < retryTimes; i++) {
            /**
             * SETNX
             * @desc Kiểm tra xem tài nguyên đã bị khóa bởi quy trình khác hay chưa
             * @returns {Boolean}
             */
            const result = await redisClient.setNX(key, expireTime)
            
            if(result === 1){
                // thao tac voi inventory
                const isReversation = await InventoryRepository.reservationInventory({
                    productId, quantity, cartId
                })

                // have transaction
                if(isReversation.modifiedCount){
                    // giai phong key 
                    await redisClient.pExpire(key, expireTime)
                    return key
                }

                return null
            }else{
                await new Promise(resolve => setTimeout(resolve, 50))
            }
        }
    }

    static releaseKey = async (keyLock) => {
        return await redisClient.del(keyLock)
    }
}

module.exports = RedisService
