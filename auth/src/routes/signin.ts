import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validationRequest } from '../middlewares/validation-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage('Email is required'),
    body('password')
      .notEmpty()
      .trim()
      .withMessage('Password is required'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isValidPassword = await Password.compare(user.password, password);

    if (!isValidPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    var token = jwt.sign(
      {
        email: user.email,
        id: user.id
      },
      process.env.JWT_KEY!);

    req.session = {
      jwt: token
    };


    res.status(200).send(user);
  }
);


export { router as userSigninRoute };