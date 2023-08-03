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
        // Нужен для работы с body (библиотека: body-parser)
        this.app.use(pkg.json())
    }

    useRoutes (): void {
        this.app.use(`${this.baseUrl}/todos`, this.todosController.router);
        this.app.use(`${this.baseUrl}/users`, this.usersController.router);
    }

    useExceptionFilters (): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init () {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port)
        this.logger.log(`*** Сервер запущен на ${this.port} порту ***`);
    }
}