import express, { Request, Response } from 'express';

import { Task } from '../models/task';
import { requiredAuth } from '../middlewares/required-auth';

const router = express.Router();

router.get('/api/tasks',
  requiredAuth,
  async (req: Request, res: Response) => {

    const userId = req.currentUser!.id;

    const tasks = await Task.find({ userId: userId });

    res.send(tasks);
  }
);

export { router as getTasksRouter };