import {NextFunction, Request, Response} from "express";
import { IExceptionFilter} from "./exception.filter.interface.js";
import { HttpError } from "./http-error.class.js";
import {injectable, inject} from "inversify";
import {ILogger} from "../logger/logger.interface.js";
import {TYPES} from "../types.js";
import 'reflect-metadata'

@injectable()
export class ExceptionFilter implements IExceptionFilter{
    constructor(@inject(TYPES.ILogger) private logger:ILogger) {}

    catch(err: Error | HttpError, req: Request, res:Response, next:NextFunction) {
        if (err instanceof  HttpError) {
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({error:err.message})
        } else {
            this.logger.error(`${err.message}`)
            res.status(500).send({error:err.message})
        }

    }
}