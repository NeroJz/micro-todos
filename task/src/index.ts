import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { createTaskRouter } from './routes/create';
import { getTasksRouter } from './routes/tasks';
import { updateTaskStatustRouter } from './routes/update-task';
import { errorHanlder } from './middlewares/error-handler';
import { rmqWrapper } from './rqm-wrapper';
import { UserCreatedConsumer } from './events/consumers/user-created-consumer';
import { currentUser } from './middlewares/current-user';
import { deleteTaskRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(cookieSession({
  signed: false
}));

app.use(currentUser);
// Add routes here
app.use(getTasksRouter);
app.use(createTaskRouter);
app.use(updateTaskStatustRouter);
app.use(deleteTaskRouter);

app.use(errorHanlder);

const start = async () => {

  if (!process.env.RMQ_CONNECTION) {
    throw new Error(`RMQ_CONNECTION is required!`);
  }

  try {
    await mongoose.connect('mongodb://todo-task-mongodb-svc:27017/task');
    console.log(`Connected to mongodb`);

    await rmqWrapper.connect(process.env.RMQ_CONNECTION)
      .catch((err) => {
        console.error(`RabbitMQ connection failed!`, err);
        process.exit();
      });

    new UserCreatedConsumer(rmqWrapper.channel!).listen();

  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on 3000...')
  });
}

start();