const amqp = require('amqplib');
const messages = 'Hello RabbitMQ user!';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:root@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, { 
            durable: true // if true, the queue will be saved when the server restarts 
         })

         await channel.sendToQueue(queueName, Buffer.from(messages))

         console.log(`[Producer] Message sent: ${messages}`)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(console.error)