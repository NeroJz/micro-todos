import express, { Request, Response } from 'express';
import { requiredAuth } from '../middlewares/required-auth';
import { Task } from '../models/task';
import { NotFoundError } from '../errors/not-found-error';

const router = express.Router();

router.delete('/api/tasks/:id',
  requiredAuth,
  async (req: Request, res: Response) => {

    let task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw new NotFoundError();
    }

    res.send(task);
  }
);


export { router as deleteTaskRouter };