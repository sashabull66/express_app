import {NextFunction, Request, Response} from "express";

export interface IUsersController {
    getUsers : (req:Request, res:Response, next:NextFunction)=> Promise<void>
    register: (req:Request, res:Response, next:NextFunction)=> Promise<void>
    removeUser: (req:Request, res:Response, next:NextFunction)=> Promise<void>
    updateUser: (req:Request, res:Response, next:NextFunction)=> Promise<void>
}