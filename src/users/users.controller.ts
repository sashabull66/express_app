import {BaseController} from "../common/base.controller.js";
import {NextFunction, Request, Response} from "express";
import {injectable, inject} from "inversify";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import 'reflect-metadata'
import {IUsersController} from "./users.controller.interface.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UsersService} from "./users.service.js";
import {HttpError} from "../errors/http-error.class.js";
import {ValidateMiddleware} from "../common/validate.middleware.js";
import {User} from "./user.model.js";

// Тут мы указываем как будет api реагировать на результат бизнес логики
@injectable()
export class UsersController extends BaseController implements IUsersController {

    constructor(@inject(TYPES.ILogger) private loggerService:ILogger, @inject(TYPES.UserService) private userService:UsersService) {
        super(loggerService)
        this.bindRoutes([
            {
                path:'/user',
                func: this.register,
                method:'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto, loggerService)]},
            {
                path:'/users',
                func: this.getUsers,
                method:'get'
            },
            {
                path:'/user',
                func: this.removeUser,
                method:'delete'
            },
            {
                path:'/user',
                func: this.updateUser,
                method:'patch'
            }
        ])
    }

    async getUsers (req:Request, res:Response, next:NextFunction):Promise<void> {
        const result = await this.userService.getUsers()

        if (!result) {
            return next(new HttpError(422, 'Пользователи не найдены', 'users'))
        }

        this.ok(res, result);
    }

    async register (req:Request<{}, {}, UserRegisterDto>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.userService.createUser(req.body)

        if (!result) {
            return next(new HttpError(422, 'Такой пользователь уже существует', 'register'))
        }

        this.ok(res, result);
    }

    async removeUser (req:Request<{}, {}, UserRegisterDto>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.userService.removeUser(req.query.email as string)

        if (!result) {
            return next(new HttpError(422, 'Не удалось удалить пользователя', 'register'))
        }

        this.ok(res, `Пользователь ${result.email} успешно удален`)
    }

    async updateUser (req:Request<{}, {}, User>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.userService.updateUser(req.body)

        if (!result) {
            return next(new HttpError(422, 'Не удалось обновить данные пользователя', 'register'))
        }

        this.ok(res, `Данные пользователя ${result.email} успешно обновлены`)

    }
}