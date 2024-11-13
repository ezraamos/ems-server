import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

interface TokenPayload extends JwtPayload {
  _id: string;
}

export interface customReq extends Request {
  user?: { firstName: string; lastName: string; role: string; email: string };
}

const verifyUser = async (
  req: customReq,
  res: Response,
  next: NextFunction
) => {
  try {
    // Correct token extraction from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(404).json({ success: false, error: 'Token not provided' });
    }

    // Verify the token
    const decoded = (await jwt.verify(
      token!,
      process.env.JWT_SECRET!
    )) as TokenPayload;

    // Look up the user by ID (correct usage of findById)
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
    }

    // Attach the user to the request object (optional, if you need user info in next middleware)
    req.user = user!;
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('error middleware', error); // Log the error
    next(error); // Pass the error to the next error handler
  }
};

export default verifyUser;
