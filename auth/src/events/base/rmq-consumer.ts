import { Channel, ConsumeMessage } from 'amqplib';
import { Queues } from '../queues';

interface QueueEvent {
  queue: Queues;
  data: any;
}


export abstract class RMQConsumer<T extends QueueEvent> {
  abstract queue: T['queue'];
  abstract handleMessage(data: T['data'], msg: ConsumeMessage): void;
  private _channel: Channel

  constructor(channel: Channel) {
    this._channel = channel;
  }

  async listen() {
    await this._channel.assertQueue(this.queue);

    this.channel.consume(this.queue, (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        console.log(
          `Message received: ${this.queue}`
        );
        const parsedData = JSON.parse(msg!.content.toString());
        this.handleMessage(parsedData, msg);
      }
    });
  }

  get channel() {
    return this._channel;
  }
}