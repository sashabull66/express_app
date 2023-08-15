import {IMiddleware} from "./middleware.interface.js";
import {NextFunction, Request, Response} from "express";
import pkg from 'jsonwebtoken'
import {IUserData} from "../types.js";

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute (req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.trim().split(' ')[1];
            pkg.verify(token, this.secret, (error, decoded) => {
                if (error) {
                    next()
                } else if (decoded && typeof decoded === 'object') {
                    // Баг в либе jsonwebtoken, фикс - использовать Object(payload)
                    req.user = Object(decoded) as IUserData;
                    next();
                }
            })
        } else {
            next();
        }
    }
}