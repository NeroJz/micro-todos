import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/current', currentUser, (req: Request, res: Response) => {
  res.send(req.currentUser);
});


export { router as currentUserRouter };