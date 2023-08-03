import {Response, Router} from "express";
import {IControllerRoute} from "./route.interface.js";
import {ILogger} from "../logger/logger.interface.js";
import {injectable} from "inversify";
import {IConfigService} from "../config/config.service.interface.js";
import 'reflect-metadata'

@injectable()
export class BaseController {
    private readonly _router: Router

    constructor(
        private logger: ILogger,
        private configService: IConfigService
    ) {
        this._router = Router();
    }

    get router () {
        return this._router
    }

    public send<T>(res: Response, message: T, code: number) {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res:Response, message:T) {
        return this.send<T>(res, message, 200);
    }

    public created ( res:Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes (routes:IControllerRoute[]) {
        const baseUrl = this.configService.get('BASE_URL');

        routes.forEach(({path, func, method, middlewares})=>{
            const handler = func.bind(this);
            const middleware = middlewares?.map(m => m.execute.bind(m))
            this.logger.log(`${method} bind ${baseUrl}${path}`);
            const pipeline = middleware ? [...middleware, handler] : handler;
            this.router[method](path, pipeline);
        })
    }
}