import express, { Express } from "express";
import { Server } from 'http'
import {UsersController} from "./users/users.controller.js";
import {ExceptionFilter} from "./errors/exception.filter.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types.js";
import {ILogger} from "./logger/logger.interface.js";
// сделать этот импорт обязательно в каждом файле, где используются декораторы
import 'reflect-metadata'

@injectable()
export class App {
    app: Express
    port: number
    server: Server

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UsersController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
    ) {
        this.app = express();
        this.port = 8000;
    }

    useRoutes () {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters () {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init () {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port)
        this.logger.log(`*** Сервер запущен на ${this.port} порту ***`);
    }
}