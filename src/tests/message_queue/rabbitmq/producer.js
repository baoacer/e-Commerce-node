const amqp = require('amqplib');
const messages = 'Hello RabbitMQ user!';

const runProducer = async () => {
    try {
        const connection = amqp.connect('amqp://localhost')
        const chanel = await connection.createChannel()

        const queueName = 'test-topic'
        await chanel.assertQueue(queueName, { 
            durable: true // if true, the queue will be saved when the server restarts 
         })
    } catch (error) {
        
    }
}