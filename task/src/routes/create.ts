import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validationRequest } from '../middlewares/validation-request';
import { Task } from '../models/task';
import { requiredAuth } from '../middlewares/required-auth';

const router = express.Router();

router.post('/api/tasks',
  requiredAuth,
  [
    body('title')
      .notEmpty()
      .trim()
      .withMessage('Task title is required')
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { title } = req.body;

    const task = Task.build({
      title,
      userId: req.currentUser!.id
    });

    await task.save();

    res.status(201).send(task);
  }
);


export { router as createTaskRouter };