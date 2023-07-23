import { Channel } from 'amqplib';
import { RMQPublisher } from '../base/rqm-publisher';
import { UserCreatedEvent } from '../create-user-event';
import { Queues } from '../queues';

export class CreateUserPublisher extends RMQPublisher<UserCreatedEvent> {
  readonly queue = Queues.UserCreated;
  constructor(channel: Channel) {
    super(channel);
  }
}