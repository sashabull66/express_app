import {Request, Response, NextFunction, Router} from "express";
import {IMiddleware} from "./middleware.interface.js";


export interface IControllerRoute {
    path: string;
    func: (req:Request<any, any, any, any>, res:Response, next:NextFunction) => void,
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>,
    middlewares?: Array<IMiddleware>
}