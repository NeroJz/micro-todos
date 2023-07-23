import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validationRequest } from '../middlewares/validation-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { CreateUserPublisher } from '../events/publishers/create-user-publisher';
import { rmqWrapper } from '../rmq-wrapper';

const router = express.Router();

router.post('/api/users',
  [
    body('email')
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage('Email is required'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password is required and must be between 4 and 20 in length'),
  ]
  , validationRequest
  , async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in used');
    }

    const user = User.build({ email, password });
    await user.save();

    new CreateUserPublisher(rmqWrapper.channel!).publish({
      userId: user.id,
      email: user.email
    });

    let token = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: token
    };

    res.status(200).send(user);
  }
);


export { router as userRegisterRoute };