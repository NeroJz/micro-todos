import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requiredAuth } from '../middlewares/required-auth';
import { validationRequest } from '../middlewares/validation-request';

import { Task } from '../models/task';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

router.put('/api/tasks/:id',
  requiredAuth,
  [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const taskId = req.params['id'];

    const userId = req.currentUser!.id;

    const task = await Task.findById(taskId);

    if (!task || !task.userId.equals(userId)) {
      throw new NotFoundError();
    }

    const { status } = req.body;

    task.set({
      status: status
    });

    await task.save();

    res.send(task);
  }
);


export { router as updateTaskStatustRouter };