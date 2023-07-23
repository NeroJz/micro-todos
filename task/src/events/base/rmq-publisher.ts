import { Channel } from 'amqplib';
import { Queues } from '../queues';

interface QueueEvent {
  queue: Queues,
  data: any
}

export abstract class RMQPublisher<T extends QueueEvent> {
  abstract queue: T['queue'];

  private channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const status = this.channel!.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));

        console.log(`Event publish to subject (${this.queue})`, status);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}