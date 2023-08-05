import {TodoDto} from "./dto/todo.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {Todo} from "./todo.model.js";
import {ICriteria} from "../types.js";

export interface ITodosService {
    createTodo: (dto:TodoDto) => Promise<DocumentType<Todo> | null>;
    removeTodo: (criteria: ICriteria) => Promise<DocumentType<Todo> | null>;
    updateTodo: (userData: Todo) => Promise<Todo | null>;
    getTodos: (criteria: ICriteria) => Promise<DocumentType<Todo>[] | null>;
}
