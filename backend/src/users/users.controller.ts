import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller.js";
import {IUsersController} from "./users.controller.interface.js";
import {IFingerprint, TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import {HttpError} from "../errors/http-error.class.js";
import {NextFunction, Request, Response} from "express";
import {UsersService} from "./users.service.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import {ValidateMiddleware} from "../common/validate.middleware.js";
import pk from "bcryptjs";
import 'reflect-metadata'
import {ConfigService} from "../config/config.service.js";
import {AuthGuard} from "../common/auth.guard.js";
import {User} from "./user.model.js";
import {Types} from "mongoose";
import {UserSessionEntity} from "./user-session.entity.js";
import moment from "moment-timezone";

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
                path:'/logout',
                func: this.logout,
                method: 'get',
                middlewares: [new AuthGuard()],
            },
            {
                path:'/user',
                func: this.updateUser,
                method: 'patch',
               // middlewares: [new AuthGuard(true)],
            },
            {
                path:'/user',
                func: this.deleteUser,
                method: 'delete',
                // middlewares: [new AuthGuard(true)],
            },
            {
                path:'/',
                func: this.getUsers,
                method: 'get',
                // middlewares: [new AuthGuard(true)],
            },
        ]);
        }

    async login (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
            const user = await this.usersService.login({ email: req.body.email });

            if (user) {
                const isValidPass = await this.comparePassword(req.body.password, user.password);

                if (!isValidPass) {
                    return next(new HttpError(401, 'Неверный пароль', 'login'));
                } else {
                    const { email, role, _id: id, name } = user;

                    const fingerprint:IFingerprint = {
                        ip: req.headers['x-forwarded-for'] as string,
                        userAgent: req.headers['user-agent'] as string,
                        acceptLanguage: req.headers['accept-language'] as string,
                        timezone: moment.tz.guess(),
                    }

                    const session = new UserSessionEntity(email, fingerprint, name, id, role);

                    await this.usersService.createSession({
                        email: session.email,
                        userId: session.userId,
                        name: session.name,
                        role: session.role,
                        sessionId: session.sessionId,
                        fingerprint: session.fingerprint
                    })

                    res.cookie('session_id', session.sessionId, {
                        httpOnly: true
                    })
                    this.ok(res, { email, role, name });
                }
            } else {
                return next(new HttpError(401, 'Пользователь не существует', 'login'));
            }
    };

    async register (req: Request<{}, {}, User>, res: Response, next: NextFunction): Promise<void> {
        const newUser = await this.usersService.register(req.body);

        if (!newUser) {
            return next(new HttpError(422, 'Не удалось создать пользователя', 'users'));
        }

        this.ok(res, { _id: newUser._id, name: newUser.name, email: newUser.email });
    };

    async updateUser (req: Request<{}, {}, User>, res: Response, next: NextFunction): Promise<void> {
        const updatedUser = await this.usersService.updateUserData(req.body)

        if (updatedUser) {
            this.ok(res, 'Данные пользователя обновлены')
        } else {
            return next(new HttpError(500, 'Не удалось обновить данные пользователя', 'update-user'))
        }
    }

    async deleteUser (req: Request<{}, {}, {}, { id: Types.ObjectId }>, res: Response, next: NextFunction): Promise<void> {
        const deletedUser = await this.usersService.removeUser(req.query.id)

        if (deletedUser) {
            this.ok(res, 'Пользователь удален')
        } else {
            return next(new HttpError(500, 'Не удалось удалить пользователя', 'update-user'))
        }
    }

    async getUsers (req: Request, res: Response, next: NextFunction): Promise<void> {
        const users = await this.usersService.getUsers();

        this.ok(res, users || [])
    }

    async logout (req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.usersService.logout(req.user.userId)
        res.clearCookie('session_id');
        this.ok(res, 'Logout success')
    }

    private async comparePassword (pass: string, hash: string): Promise<boolean> {
        return await pk.compare(pass, hash);
    }
}