import {TodoDto} from "./dto/todo.dto.js";
import {TodoEntity} from "./todo.entity.js";
import {inject, injectable} from "inversify";
import {ICriteria, TYPES} from "../types.js";
import {ConfigService} from "../config/config.service.js";
import {Todo, TodoModel} from "./todo.model.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {ITodosService} from "./todos.service.interface.js";
import 'reflect-metadata'

// Вся бизнес-логика будет находиться здесь
@injectable()
export class TodosService implements ITodosService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}

    async createTodo ({ title, description, done, userId }: TodoDto): Promise<DocumentType<Todo> | null> {

        const newTodo = new TodoEntity(title, description, done, userId)

        return await TodoModel.create({
                title: newTodo.title,
                description: newTodo.description,
                done: newTodo.done,
                userId: newTodo.userId
            })
    };

    async removeTodo (criteria: ICriteria): Promise<DocumentType<Todo> | null> {
        try {
            const deletedTodo = await TodoModel.findOneAndRemove(criteria).exec();

            return deletedTodo || null
        } catch (e) {
            return  null
        }
    };

    async updateTodo (todoData: Todo): Promise<Todo | null> {
        const updTodo = await TodoModel.updateOne({_id: todoData._id}, todoData);

        if (updTodo) {
            return todoData
        } else {
            return null
        }
    };

    async getTodos (criteria: ICriteria): Promise<DocumentType<Todo>[] | null> {
        try {
            return await TodoModel.find(
                criteria,
                // Выборка нужных полей
                {title: 1, description: 1, done: 1, _id: 1}
            ).exec()
        } catch (e) {
            return  null
        }
    };
}