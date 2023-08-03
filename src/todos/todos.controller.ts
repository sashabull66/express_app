import {BaseController} from "../common/base.controller.js";
import {NextFunction, Request, Response} from "express";
import {injectable, inject} from "inversify";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import 'reflect-metadata'
import {ITodosController} from "./todos.controller.interface.js";
import {TodoDto} from "./dto/todo.dto.js";
import {TodosService} from "./todos.service.js";
import {HttpError} from "../errors/http-error.class.js";
import {Todo} from "./todo.model.js";
import {ConfigService} from "../config/config.service.js";

@injectable()
export class TodosController extends BaseController implements ITodosController {

    constructor(
        @inject(TYPES.ILogger)
        private loggerService: ILogger,
        @inject(TYPES.TodoService)
        private todosService: TodosService,
        @inject(TYPES.ConfigService) configService: ConfigService
        )
        {
        super(loggerService, configService)
        this.bindRoutes([
            {
                path:'/',
                func: this.getTodos,
                method:'get'
            },
            {
                path:'/todo',
                func: this.createTodo,
                method:'post',
            },
            {
                path:'/todo',
                func: this.removeTodo,
                method:'delete'
            },
            {
                path:'/todo',
                func: this.updateTodo,
                method:'patch'
            }
        ])
    }

    async getTodos (req:Request, res:Response, next:NextFunction):Promise<void> {
        const result = await this.todosService.getTodos()

        if (!result?.length) {
            return next(new HttpError(422, 'Задачи не найдены', 'todos'))
        }

        this.ok(res, result);
    }

    async createTodo (req:Request<{}, {}, TodoDto>, res:Response):Promise<void> {
        const result = await this.todosService.createTodo(req.body)

        if (result) this.created(res);
    }

    async  removeTodo (req:Request<{}, {}, TodoDto, { id: string }>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.todosService.removeTodo(req.query.id)

        if (!result) {
            return next(new HttpError(422, `Не удалось удалить задачу ${req.query.id}`, 'todo'))
        }

        this.ok(res, `Задача ${req.query.id} успешно удалена`)
    }

    async updateTodo (req:Request<{}, {}, Todo>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.todosService.updateTodo(req.body)

        if (!result) {
            return next(new HttpError(422, 'Не удалось обновить задачу', 'todo'))
        }

        this.ok(res, `Задача ${result.title} успешно обновлена`)

    }
}