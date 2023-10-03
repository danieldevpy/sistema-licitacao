import { Request } from 'express';
import User from '../../src/domain/entity/user';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}