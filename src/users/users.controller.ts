import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller.js";
import {IUsersController} from "./users.controller.interface.js";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import {HttpError} from "../errors/http-error.class.js";
import {NextFunction, Request, Response} from "express";
import {UsersService} from "./users.service.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import {ValidateMiddleware} from "../common/validate.middleware.js";
import 'reflect-metadata'

@injectable()
export class UsersController extends BaseController implements IUsersController {

    constructor(
        @inject(TYPES.ILogger)
        private readonly loggerService: ILogger,
        @inject(TYPES.UsersService)
        private readonly usersService: UsersService
        ) {
        super(loggerService);
        this.bindRoutes([
            {
                path:'/login',
                func: this.login,
                method: 'post',
            },
            {
                path:'/register',
                func: this.register,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto, loggerService)],
            }
        ]);
        }

    async login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.usersService.login(req.body);

        if (!result) {
            return next(new HttpError(422, 'Не удалось авторизовать пользователя', 'users'));
        }

        this.ok(res, result);
    };

    async register (req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.usersService.register(req.body);

        if (!result) {
            return next(new HttpError(422, 'Не удалось создать пользователя', 'users'));
        }

        this.ok(res, result);
    };

}