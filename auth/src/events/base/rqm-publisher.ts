import { Channel } from 'amqplib';
import { Queues } from '../queues';

interface QueueEvent {
  queue: Queues;
  data: any;
}

export abstract class RMQPublisher<T extends QueueEvent> {
  abstract queue: T['queue'];
  private _channel: Channel;

  constructor(channel: Channel) {
    this._channel = channel;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const status = this._channel
          .sendToQueue(
            this.queue,
            Buffer.from(JSON.stringify(data))
          );

        console.log(`Event publish to queue(${this.queue}):`, status);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}