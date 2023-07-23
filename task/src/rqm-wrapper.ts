import amqplib, { Channel } from 'amqplib';

class RMQWrapper {
  private _channel?: Channel;

  connect(connectionUrl: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const conn = await amqplib.connect(connectionUrl);
        this._channel = await conn.createChannel();
        console.log('Connected to RMQ');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  get channel() {
    return this._channel;
  }
}

export const rmqWrapper = new RMQWrapper();