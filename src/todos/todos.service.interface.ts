import {TodoDto} from "./dto/todo.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {Todo} from "./todo.model.js";

export interface ITodosService {
    createTodo: (dto:TodoDto) => Promise<DocumentType<Todo> | null>
    removeTodo: (email:string) => Promise<DocumentType<Todo> | null>
    updateTodo: (userData: Todo) => Promise<Todo | null>
    getTodos: () => Promise<DocumentType<Todo>[] | null>
}
