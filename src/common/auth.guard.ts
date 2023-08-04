import {IMiddleware} from "./middleware.interface.js";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class.js";

export class AuthGuard implements IMiddleware {
    constructor(private adminOnly?: boolean) {}

    execute (req: Request, res: Response, next: NextFunction): void {
        const user = req.user;
        const role = req.role;
        if (this.adminOnly) {
            return user && role === 'admin' ? next() : next(new HttpError(401, 'Пользователь не авторизован или не хватает прав доступа'));
        } else if (user) {
            return next();
        } else {
            return next(new HttpError(401, 'Пользователь не авторизован'));
        }
    }
}