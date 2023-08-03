import {NextFunction, Request, Response} from "express";
import {TodoDto} from "./dto/todo.dto.js";

export interface ITodosController {
    getTodos : (req:Request, res:Response, next:NextFunction)=> Promise<void>
    createTodo: (req:Request, res:Response, next:NextFunction)=> Promise<void>
    removeTodo: (req:Request<{}, {}, TodoDto, { id: string }>, res:Response, next:NextFunction)=> Promise<void>
    updateTodo: (req:Request, res:Response, next:NextFunction)=> Promise<void>
}