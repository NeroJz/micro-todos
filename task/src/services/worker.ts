import amqplib from 'amqplib';

class RabbitMQWorker {
  private ch?: amqplib.Channel;

  constructor() { }

  async connect(connectionString: string) {
    const conn = await amqplib.connect(connectionString);
    console.log(`RabbitMQ connected!`);
    this.ch = await conn.createChannel();
  }

  send(queue: string, message: any) {
    console.log('Start sending message...');
    if (!this.ch) {
      throw new Error('Worker must be connect first!');
    }

    const status = this.ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(`Message send status: ${status}`);
  }
}

class RabbitMQConsumer {
  private ch?: amqplib.Channel;

  constructor() { }

  async consume(connectionString: string, queue: string) {
    const conn = await amqplib.connect(connectionString);
    console.log(`RabbitMQ connected!`);

    this.ch = await conn.createChannel();
    await this.ch.assertQueue(queue);

    this.ch.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`Received:`, msg.content.toString());
        this.ch?.ack(msg);
      }
    });
  }
}


const messageBroker = new RabbitMQWorker();
const messageConsumer = new RabbitMQConsumer();

export {
  messageBroker as MessageBroker,
  messageConsumer as RMQConsumer
};