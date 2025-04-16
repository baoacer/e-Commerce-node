const amqp = require('amqplib');
const messages = 'Hello RabbitMQ user!';

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:root@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, { 
            durable: true // if true, the queue will be saved when the server restarts 
         })

         await channel.consume(queueName, (messages) => {
            console.log(`[Consumer] Message received: ${messages.content.toString()}`)
         }, {
            noAck: true // if true, data is handled -> not handled again
         })
    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch(console.error)