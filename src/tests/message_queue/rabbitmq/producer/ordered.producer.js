const amqp = require('amqplib')

const runProducerOrdered = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:root@localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queue'

        await channel.assertQueue(queueName, {
            durable: true
        })

        for (let i = 0; i < 10; i++) {
            const message = `Message Ordered::${i}`
            console.log(`Message:${message}`)
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            })            
        }
        setTimeout(() => {
            connection.close()
        }, 1000)
    } catch (error) {
        console.error(`Producer Ordered - Error:::${error}`)
    }
}

runProducerOrdered()