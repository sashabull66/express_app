import {App} from "./app.js";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface.js";
import {LoggerService} from "./logger/logger.service.js";
import {TYPES} from "./types.js";
import {ExceptionFilter} from "./errors/exception.filter.js";
import {UsersController} from "./users/users.controller.js";
import {IExceptionFilter} from "./errors/exception.filter.interface.js";
import {IUsersController} from "./users/users.controller.interface.js";

// По хорошему биндинги нужно выносить в разные файлы в зависимости от доменной зоны
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    // в jenerik можно вставлять как interface так и сам class
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUsersController>(TYPES.UserController).to(UsersController);
    bind<App>(TYPES.Application).to(App);
})

const bootstrap = () => {
    const appContainer = new Container();

    //Загружаю биндинги в контейнер
    appContainer.load(appBindings);

    // Получаю инстанс App
    const app = appContainer.get<App>(TYPES.Application);

    // Вызываю метод init у класса App
    app.init();

    return {app, appContainer}
}





export const {app, appContainer} = bootstrap();