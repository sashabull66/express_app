import {App} from "./app.js";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface.js";
import {LoggerService} from "./logger/logger.service.js";
import {TYPES} from "./types.js";
import {ExceptionFilter} from "./errors/exception.filter.js";
import {TodosController} from "./todos/todos.controller.js";
import {IExceptionFilter} from "./errors/exception.filter.interface.js";
import {TodosService} from "./todos/todos.service.js";
import {IConfigService} from "./config/config.service.interface.js";
import {ConfigService} from "./config/config.service.js";
import {MongoDbConfig} from "./config/mongo-db.config.js";
import {ITodosController} from "./todos/todos.controller.interface.js";
import {ITodosService} from "./todos/todos.service.interface.js";
import {UsersController} from "./users/users.controller.js";
import {UsersService} from "./users/users.service.js";
import {IUsersController} from "./users/users.controller.interface.js";
import {IUsersService} from "./users/users.service.interface.js";

// По хорошему биндинги нужно выносить в разные файлы в зависимости от доменной зоны
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    // в jenerik можно вставлять как interface так и сам class
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();

    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();

    bind<App>(TYPES.Application).to(App).inSingletonScope();

    bind<MongoDbConfig>(TYPES.MongoDBConfig).to(MongoDbConfig).inSingletonScope();

    bind<ITodosController>(TYPES.TodoController).to(TodosController).inSingletonScope();
    bind<ITodosService>(TYPES.TodoService).to(TodosService).inSingletonScope();

    bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
    bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
})

const bootstrap = () => {
    const appContainer = new Container();

    //Загружаю биндинги в контейнер
    appContainer.load(appBindings);

    // Получаю инстанс App
    const app = appContainer.get<App>(TYPES.Application);
    // Получаю инстанс MongoDbConfig
    const mongoDBConfig = appContainer.get<MongoDbConfig>(TYPES.MongoDBConfig);

    // Вызываю метод init у класса App
    app.init();
    mongoDBConfig.connectToDB();

    return {app, appContainer}
}





export const {app, appContainer} = bootstrap();