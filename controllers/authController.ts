import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { customReq } from '../middleware/authMiddleware';

dotenv.config();

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, error: 'user not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).send({ success: false, error: 'incorrect credentials' });
      return;
    }

    const token = jwt.sign(
      { _id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '10d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.log('error logging in', error);
    throw new Error('Error user login');
  }
};

const verify = async (req: customReq, res: Response) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  }
};

export { login, verify };
