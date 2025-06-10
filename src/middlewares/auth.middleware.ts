import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 'AUTH_001',
      message: 'Authentication token is required'
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('decoded: ', JSON.stringify(decoded));
    // req['user'] = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      code: 'AUTH_002',
      message: 'Invalid authentication token',
      additionalInfo: error.message
    });
  }
};
