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
import pkg from 'jsonwebtoken';
import pk from "bcryptjs";
import 'reflect-metadata'
import {ConfigService} from "../config/config.service.js";
import {AuthGuard} from "../common/auth.guard.js";
import { Types } from "mongoose";

@injectable()
export class UsersController extends BaseController implements IUsersController {

    constructor(
        @inject(TYPES.ILogger)
        private readonly loggerService: ILogger,
        @inject(TYPES.UsersService)
        private readonly usersService: UsersService,
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
        ) {
        super(loggerService);
        this.bindRoutes([
            {
                path:'/login',
                func: this.login,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserLoginDto, loggerService)],
            },
            {
                path:'/register',
                func: this.register,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto, loggerService)],
            },
            {
                path:'/info',
                func: this.info,
                method: 'get',
                middlewares: [new AuthGuard()],
            },
        ]);
        }

    async login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.usersService.login({ email: req.body.email });

        if (result) {
            const isValidPass = await this.comparePassword(req.body.password, result.password);

            if (!isValidPass) {
                return next(new HttpError(401, 'Ошибка авторизации', 'login'));
            } else {
                const { email, role, _id } = result;
                const secret = this.configService.get('JWT_SECRET');
                const jwt = await this.signJWT({ id: _id, email, role }, secret);

                this.ok(res, { jwt, email, role });
            }
        }
    };

    async register (req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.usersService.register(req.body);

        if (!result) {
            return next(new HttpError(422, 'Не удалось создать пользователя', 'users'));
        }

        this.ok(res, result);
    };

    async info ({ user }: Request, res: Response, next: NextFunction): Promise<void> {
        this.ok(res, user)
    }

    private signJWT (data: { email: string, role: string, id: Types.ObjectId }, secret: string):Promise<string> {
        return new Promise((resolve, reject) => {
            pkg.sign({
                ...data,
                iat: Math.floor(Date.now() / 1000)
            }, secret, {
                algorithm:'HS256'
            }, (error, encoded)=>{
                if (error) {
                    reject(error)
                } else if (encoded) {
                    resolve(encoded)
                }
            })
        })
    }

    private async comparePassword (pass: string, hash: string): Promise<boolean> {
        return await pk.compare(pass, hash);
    }
}