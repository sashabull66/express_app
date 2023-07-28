import {App} from "./app.js";
import {LoggerService} from "./logger/logger.service.js";
import {UsersController} from "./users/users.controller.js";
import {ExceptionFilter} from "./errors/exception.filter.js";

const bootstrap = async () => {
    const logger = new LoggerService();
    const app = new App(
        logger,
        new UsersController(logger),
        new ExceptionFilter(logger)
    );

    await app.init()
}

bootstrap();