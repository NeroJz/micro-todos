import { Queues } from './queues';

export interface UserCreatedEvent {
  queue: Queues.UserCreated;
  data: {
    userId: string;
    email: string;
  }
}