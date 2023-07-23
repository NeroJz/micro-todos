import { ConsumeMessage } from 'amqplib';
import { RMQConsumer } from '../base/rmq-consumer';
import { Queues } from '../queues';
import { UserCreatedEvent } from '../user-created-event';

export class UserCreatedConsumer extends RMQConsumer<UserCreatedEvent>{
  readonly queue = Queues.UserCreated;

  handleMessage(data: UserCreatedEvent['data'], msg: ConsumeMessage): void {
    console.log(`${this.queue} event received`, data);

    this.channel.ack(msg);
  }
}