// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

export interface IUsersController {
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteUser: (
    req: Request<{}, {}, {}, { id: Types.ObjectId }>,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
