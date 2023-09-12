import { IMiddleware } from './middleware.interface.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class.js';

export class AuthGuard implements IMiddleware {
  constructor(private adminOnly?: boolean) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    if (this.adminOnly && req.user) {
      return req.user?.role === 'admin'
        ? next()
        : next(new HttpError(401, 'Пользователь не авторизован или не хватает прав доступа'));
    } else if (req.user) {
      return next();
    } else {
      return next(new HttpError(401, 'Пользователь не авторизован', 'unknown'));
    }
  }
}
