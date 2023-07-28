import {LoggerService} from "../logger/logger.service.js";
import {Response, Router} from "express";
import {IRoute} from "./route.interface.js";

export abstract class BaseController {
    private readonly _router:Router
    protected constructor(private logger:LoggerService) {
        this._router = Router();
    }

    get router () {
        return this._router
    }

    public send<T>(res:Response, message:T, code:number) {
        res.type('application/json')
        return res.status(200).json(message);
    }

    public ok<T>(res:Response, message:T) {
        return this.send<T>(res, message, 200);
    }

    public created ( res:Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes (routes:IRoute[]) {
        routes.forEach(({path, func, method})=>{
            const handler = func.bind(this);
            this.logger.log(`${method} bind ${path}`);
            this.router[method](path, handler);
        })
    }
}