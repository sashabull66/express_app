import {BaseController} from "../common/base.controller.js";
import {LoggerService} from "../logger/logger.service.js";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class.js";

export class UsersController extends BaseController {

    constructor(logger:LoggerService) {
        super(logger)
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