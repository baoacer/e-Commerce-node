const amqp = require('amqplib')

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:root@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notification-exchange'
        const notificationQueue = 'notification-queue'
        const notificationRoutingKey = 'notification-queue-routing-key'
        const notificationExchangeDLX = 'notification-exchange-dlx'
        const notificationRoutingKeyDLX = 'notification-routing-key-dlx'

        // 1 - Create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {durable: true})

        // 2 - Create Queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            durable: true,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3 - binding
        await channel.bindQueue(queueResult.queue, notificationExchange, notificationRoutingKey)

        // 4 - publish message
        const msg = 'New Product!'
        channel.publish(notificationExchange, notificationRoutingKey, Buffer.from(msg), {
            expiration: '5000',
            persistent: true
        })

        console.log(`Producer DLX - Message sent: ${msg}`)

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 2000)
    } catch (error) {
        console.error(`Producer DLX - Error:::${error}`)
    }
}

runProducer()
