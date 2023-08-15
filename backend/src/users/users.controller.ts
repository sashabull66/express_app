import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller.js";
import {IUsersController} from "./users.controller.interface.js";
import {IUserData, TYPES} from "../types.js";
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
import {User} from "./user.model.js";
import {Types} from "mongoose";

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
                path:'/refresh',
                func: this.refresh,
                method: 'get',
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

                    const accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
                    const accessToken = await this.signJWT({ id, email, role }, accessTokenSecret, '1m');

                    const refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');
                    const refreshToken = await this.signJWT({ id, email, role }, refreshTokenSecret, '30d');

                    await this.usersService.saveToken({ refreshToken, userId: id })

                    res.cookie('refresh_token', refreshToken, {
                        httpOnly: true
                    })
                    this.ok(res, { email, role, name, access_token: accessToken });
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
        await this.usersService.logout(req.user.id)
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        this.ok(res, 'Logout success')
    }

    async refresh (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            return next(new HttpError(401, 'Отсутствует refresh токен', 'refresh'))
        }

            const refreshTokenFromDB = await this.usersService.getRefreshToken(refresh_token);
            if (!refreshTokenFromDB) {
                return next(new HttpError(401, 'Неверные учетные данные', 'refresh'))
            }

            const verifiedData = await this.verifyRefreshToken(refresh_token);
            const userData = await this.usersService.getUserById(refreshTokenFromDB.userId)

            if (!verifiedData && !userData) {
                return next(new HttpError(401, 'Невалидный refresh токен', 'refresh'))
            }

            if (userData) {
                const accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
                const accessToken = await this.signJWT(userData, accessTokenSecret, '5s');

                const refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');
                const refreshToken = await this.signJWT(userData, refreshTokenSecret, '30d');

                await this.usersService.saveToken({ refreshToken, userId: userData._id })

                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true
                })

                const { email, role, name } = userData;

                this.ok(res, { email, role, name, access_token: accessToken });
            }
    }

    private verifyRefreshToken (refreshToken: string):Promise<IUserData | null> {
            const secret = this.configService.get('REFRESH_TOKEN_SECRET');
            return new Promise((resolve, reject) => {
                pkg.verify(refreshToken, secret, (error, decoded) => {
                    if (error) {
                        reject(null)
                    } else if (decoded) {
                        resolve(decoded as IUserData)
                    }
                })
            })
    }

    private signJWT (data: IUserData | Record<string, any>, secret: string, expiresIn:string): Promise<string> {
        return new Promise((resolve, reject) => {
            pkg.sign({
                ...data,
                iat: Math.floor(Date.now() / 1000)
            }, secret, {
                algorithm:'HS256',
                expiresIn
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