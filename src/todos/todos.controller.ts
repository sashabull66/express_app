import {BaseController} from "../common/base.controller.js";
import {NextFunction, Request, Response} from "express";
import {injectable, inject} from "inversify";
import {ICriteria, TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import {ITodosController} from "./todos.controller.interface.js";
import {TodoDto} from "./dto/todo.dto.js";
import {TodosService} from "./todos.service.js";
import {HttpError} from "../errors/http-error.class.js";
import {Todo} from "./todo.model.js";
import 'reflect-metadata'
import {AuthGuard} from "../common/auth.guard.js";

@injectable()
export class TodosController extends BaseController implements ITodosController {

    constructor(
        @inject(TYPES.ILogger)
        private loggerService: ILogger,
        @inject(TYPES.TodoService)
        private todosService: TodosService,
        )
        {
        super(loggerService);
        this.bindRoutes([
            {
                path:'/',
                func: this.getTodos,
                method:'get',
                middlewares:[new AuthGuard()]
            },
            {
                path:'/todo',
                func: this.createTodo,
                method:'post',
                middlewares:[new AuthGuard()]
            },
            {
                path:'/todo',
                func: this.removeTodo,
                method:'delete',
                middlewares:[new AuthGuard()]
            },
            {
                path:'/todo',
                func: this.updateTodo,
                method:'patch',
                middlewares:[new AuthGuard()]
            }
        ]);
    }

    async getTodos (req:Request, res:Response, next:NextFunction):Promise<void> {
        let criteria: ICriteria = {};

        if (req.user.role === 'user') {
            criteria.userId = req.user.id
        }

        const result = await this.todosService.getTodos(criteria);

        if (!result?.length) {
            return next(new HttpError(404, 'Задачи не найдены', 'todos'));
        }

        this.ok(res, result);
    };

    async createTodo (req:Request<{}, {}, TodoDto>, res:Response):Promise<void> {
        const result = await this.todosService.createTodo(req.body);

        if (result) this.created(res);
    };

    async  removeTodo (req:Request<{}, {}, TodoDto, { id: string }>, res:Response, next:NextFunction):Promise<void> {
        let criteria: ICriteria = { id: req.query.id };

        if (req.user.role === 'user') {
            criteria.userId = req.user.id
        }

        const result = await this.todosService.removeTodo(criteria);

        if (!result) {
            return next(new HttpError(422, `Не удалось удалить задачу ${ criteria.id }`, 'todo'));
        }

        this.ok(res, `Задача ${ criteria.id } успешно удалена`);
    };

    async updateTodo (req:Request<{}, {}, Todo>, res:Response, next:NextFunction):Promise<void> {
        const result = await this.todosService.updateTodo(req.body);

        if (!result) {
            return next(new HttpError(422, 'Не удалось обновить задачу', 'todo'));
        }

        this.ok(res, `Задача ${result.title} успешно обновлена`);
    };
}