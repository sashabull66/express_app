import express, { Express } from "express";
import { Server } from 'http'
import {TodosController} from "./todos/todos.controller.js";
import {UsersController} from "./users/users.controller.js";
import {ExceptionFilter} from "./errors/exception.filter.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types.js";
import {ILogger} from "./logger/logger.interface.js";
import pkg from "body-parser";
import {ConfigService} from "./config/config.service.js";
import 'reflect-metadata'
import {AuthMiddleware} from "./common/auth.middleware.js";
import cookieParser from 'cookie-parser/index.js'

@injectable()
export class App {
    app: Express
    port: number
    server: Server
    baseUrl: string

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: ConfigService,
        @inject(TYPES.TodoController) private todosController: TodosController,
        @inject(TYPES.UsersController) private usersController: UsersController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    ) {
        this.app = express();
        this.port = Number(this.configService.get('PORT')) || 8000;
        this.baseUrl = this.configService.get('BASE_URL') || '/api';
    }

    useMiddleware (): void {
        const secret = this.configService.get('ACCESS_TOKEN_SECRET');
        /**
         * Middleware которые будет брать из request.headers.authorization jwt токен,
         * парсить его и класть в этот же request role и login из токена.
         * */
        const authMiddleware = new AuthMiddleware(secret);
        // Нужен для работы с body (библиотека: body-parser)
        this.app.use(pkg.json());
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes (): void {
        this.app.use(`${this.baseUrl}/todos`, this.todosController.router);
        this.app.use(`${this.baseUrl}/users`, this.usersController.router);
    }

    useExceptionFilters (): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    useLogPath (): void {
        this.app.all(/.*/, (req, res, next) =>{
            this.logger.warn("path: ", req.path)
            next()
        })
    }

    useCookie (): void {
        this.app.use(cookieParser());
    }

    public async init () {
        this.useCookie();
        this.useLogPath();
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port)
        this.logger.log(`*** Сервер запущен на ${this.port} порту ***`);
    }
}