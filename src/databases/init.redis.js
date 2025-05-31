'use strict'
const redis = require('redis')
const { REDIS_CONNECT_MESSAGE, REDIS_CONNECT_TIMEOUT } = require('../configs/contants')
const { RedisErrorResponse } = require('../core/error.response')

let client = {}
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}
let connectionTimeout;
 
class RedisDb {
    handleEventConnection = ({ connectionRedis }) => {
        connectionRedis.on(statusConnectRedis.CONNECT, () => {
            console.log(`Connection Redis - Connect Status: connected`)
            clearTimeout(connectionTimeout)
        })

        connectionRedis.on(statusConnectRedis.END, () => {
            console.log(`Connection Redis - Connect Status: disconnected`)
            // retry connect
            this.handleConnectTimeout()
        })

        connectionRedis.on(statusConnectRedis.RECONNECT, () => {
            console.log(`Connection Redis - Connect Status: reconnecting`)
            clearTimeout(connectionTimeout)
        })

        connectionRedis.on(statusConnectRedis.ERROR, (err) => {
            console.log(`Connection Redis - Connect Status: error ${err}`)
        })
    }

    initRedis = async () => {
        if(client.instanceRedis){
            try {
                await client.instanceRedis.quit()
            } catch (error) {
                console.error('Error closing old redis client:: ', error)
            }
        }
        const instanceRedis = redis.createClient()
        client.instanceRedis = instanceRedis
        this.handleEventConnection({
            connectionRedis: instanceRedis
        })
        try {
            await instanceRedis.connect()
        } catch (error) {
            console.error('Redis connect error:: ', error)
            this.handleConnectTimeout()
        }
    }

    getRedis = () => client

    closeRedis = async () => {
        if(client.instanceRedis){
            await client.instanceRedis.quit()
            client.instanceRedis = null
            console.log('Redis connection closed')
        }
    }

    handleConnectTimeout = () => {
        connectionTimeout = setTimeout(() => {
            throw new RedisErrorResponse({
                message: REDIS_CONNECT_MESSAGE.message,
                status: REDIS_CONNECT_MESSAGE.code
            })
        }, REDIS_CONNECT_TIMEOUT)
    }
}

module.exports = new RedisDb()