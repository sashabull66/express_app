import {App} from "./app.js";
import {Container} from "inversify";
import {ILogger} from "./logger/logger.interface.js";
import {LoggerService} from "./logger/logger.service.js";
import {TYPES} from "./types.js";
import {ExceptionFilter} from "./errors/exception.filter.js";
import {UsersController} from "./users/users.controller.js";
import {IExceptionFilter} from "./errors/exception.filter.interface.js";

const appContainer = new Container();

// в jenerik можно вставлять как interface так и сам class
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
appContainer.bind<UsersController>(TYPES.UserController).to(UsersController);
appContainer.bind<App>(TYPES.Application).to(App);

// Получаю инстанс App
const app = appContainer.get<App>(TYPES.Application);

app.init();

export {app, appContainer};