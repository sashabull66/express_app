import {Types} from "mongoose";

export const TYPES = {
    Application: Symbol.for('Application'),
    ILogger: Symbol.for('ILogger'),
    TodoController: Symbol.for('TodoController'),
    TodoService: Symbol.for('TodoService'),
    ConfigService: Symbol.for('ConfigService'),
    UsersService: Symbol.for('UsersService'),
    UsersController: Symbol.for('UsersController'),
    ExceptionFilter: Symbol.for('ExceptionFilter'),
    MongoDBConfig: Symbol.for('MongoDBConfig')
}

export interface ICriteria {
    id?: string,
    _id?: string,
    userId?: string
}

export interface IUserData {
    id: Types.ObjectId,
    email: string,
    role: 'admin' | 'user'
}