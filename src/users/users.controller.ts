import {BaseController} from "../common/base.controller.js";
import {LoggerService} from "../logger/logger.service.js";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class.js";
import {injectable, inject} from "inversify";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import 'reflect-metadata'
import {IUsersController} from "./users.controller.interface.js";

@injectable()
export class UsersController extends BaseController implements IUsersController {

    constructor(@inject(TYPES.ILogger) private loggerService:ILogger) {
        super(loggerService)
        this.bindRoutes([
            {path:'/register', func: this.register, method:'post'},
            {path:'/login', func: this.login, method:'post'}
        ])
    }

    login (req:Request, res:Response, next:NextFunction) {
        this.ok(res, 'login');
    }
    register (req:Request, res:Response, next:NextFunction) {
        // this.ok(res, 'register');
        next(new HttpError(501, 'Ошибка какая-то', 'Context'))
    }
}