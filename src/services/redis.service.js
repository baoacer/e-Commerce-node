'use strict'

const redis = require('redis')
const { promisify } = require('util')
const InventoryRepository = require('./repositories/inventory.repo')
const redisClient = redis.createClient() // connect redis server

// promisify : chuyen doi callback thanh promise (async/await)
const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient)
const setnxAsync = promisify(redisClient.SETNX).bind(redisClient) 

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
            const result = await setnxAsync(key, expireTime)
            console.log(`result:::${result}`)
            
            if(result === 1){
                // thao tac voi inventory
                const isReversation = await InventoryRepository.reservationInventory({
                    productId, quantity, cartId
                })

                // have transaction
                if(isReversation.modifiedCount){
                    // giai phong key 
                    await pexpire(key, expireTime)
                    return key
                }

                return null
            }else{
                await new Promise(resolve => setTimeout(resolve, 50))
            }
        }
    }

    static releaseKey = async (keyLock) => {
        const delAsyncKey = promisify(redisClient.DEL).bind(redisClient)
        return await delAsyncKey(keyLock)
    }
}

module.exports = RedisService
