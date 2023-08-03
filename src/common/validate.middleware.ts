import {IMiddleware} from "./middleware.interface.js";
import {NextFunction, Request, Response} from "express";
import {ClassConstructor, plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";
import 'reflect-metadata'

@injectable()
export class ValidateMiddleware implements IMiddleware {
    constructor(private classToValidate: ClassConstructor<object>, @inject(TYPES.ILogger) private logger: ILogger) {}

    async execute ({body}: Request, res: Response, next: NextFunction): Promise<void> {
        const instance = plainToInstance(this.classToValidate, body);

        const errors = await validate(instance);

        if (errors.length) {
            errors.forEach(e=>{
                if (e.constraints) this.logger.error(`Ошибка: ${Object.values(e.constraints).join(', ')}`);

            })
            res.status(422).send(errors);
        } else {
            next();
        }
    };
}