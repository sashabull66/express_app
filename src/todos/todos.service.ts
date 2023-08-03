import {TodoDto} from "./dto/todo.dto.js";
import {TodoEntity} from "./todo.entity.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ConfigService} from "../config/config.service.js";
import {Todo, TodoModel} from "./todo.model.js";
import { DocumentType } from "@typegoose/typegoose/lib/types.js";
import {ITodosService} from "./todos.service.interface.js";

// Вся бизнес-логика будет находиться здесь
@injectable()
export class TodosService implements ITodosService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}

    async createTodo ({title, description, done}:TodoDto): Promise<DocumentType<Todo> | null> {

        const newTodo = new TodoEntity(title, description, done)

        return await TodoModel.create({
                title: newTodo.title,
                description: newTodo.description,
                done: newTodo.done
            })
    };

    async removeTodo (id?: string): Promise<DocumentType<Todo> | null> {
        try {
            const deletedTodo = await TodoModel.findOneAndRemove({_id: id}).exec();

            return deletedTodo || null
        } catch (e) {
            return  null
        }
    };

    async updateTodo (todoData: Todo): Promise<Todo | null> {
        const updUser = await TodoModel.updateOne({_id: todoData._id}, todoData);

        if (updUser) {
            return todoData
        } else {
            return null
        }
    };

    async getTodos ():Promise<DocumentType<Todo>[] | null> {
        return await TodoModel.find().exec()
    };
}