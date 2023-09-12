// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Response, Router } from 'express';
import { IControllerRoute } from './route.interface.js';
import { ILogger } from '../logger/logger.interface.js';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, message: T, code: number): Response {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): Response {
    return this.send<T>(res, message, 200);
  }

  public created(res: Response): Response {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    routes.forEach(({ path, func, method, middlewares }) => {
      const handler = func.bind(this);
      const middleware = middlewares?.map((m) => m.execute.bind(m));
      this.logger.log(`${method} bind ${path}`);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[method](path, pipeline);
    });
  }
}
