import express, { Request, Response } from 'express';

import { currentUser } from '../middlewares/current-user';
import { requiredAuth } from '../middlewares/required-auth';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users',
  currentUser,
  requiredAuth,
  async (req: Request, res: Response) => {

    let users = await User
      .find({});

    res.send(users);
  }
);

export { router as usersRouter };