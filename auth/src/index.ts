import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHanlder } from './middlewares/error-handler';
import { usersRouter } from './routes/users';
import { userRegisterRoute } from './routes/register';
import { userSigninRoute } from './routes/signin';
import { userSignoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';
import { rmqWrapper } from './rmq-wrapper';

const app = express();
app.set('trust proxy', true);
app.use(cookieSession({
  signed: false,
}));
app.use(json());

app.use(usersRouter);
app.use(userRegisterRoute);
app.use(userSigninRoute);
app.use(userSignoutRouter);
app.use(currentUserRouter);

app.use(errorHanlder);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error(`JWT_KEY is required!!!`);
  }

  if (!process.env.RMQ_CONNECTION) {
    throw new Error(`RMQ_Connection is required!!!`);
  }

  try {
    await mongoose.connect('mongodb://todo-auth-mongodb-svc:27017/todo-auth');
    console.log(`Connected to mongodb`);

    await rmqWrapper.connect(process.env.RMQ_CONNECTION!);

  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on 3000...')
  });
}

start();