const amqp = require('amqplib')

const runConsumerOrdered = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:root@localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queue'

        await channel.assertQueue(queueName, {
            durable: true
        })
        // set prefetch - ensure only one ack at time
        channel.prefetch(1)

        await channel.consume(queueName, msg => {
            const message = msg.content.toString()

            setTimeout(() => {
                console.log(`Processed::${message}`)
                channel.ack(msg) // complete message
            }, Math.random() * 1000)
        })
    } catch (error) {
        console.error(`Producer Ordered - Error:::${error}`)
    }
}

runConsumerOrdered()