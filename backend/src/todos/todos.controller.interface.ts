// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NextFunction, Request, Response } from 'express';

export interface ITodosController {
  getTodos: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createTodo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  removeTodo: (
    req: Request<{}, {}, {}, { id: string }>,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  updateTodo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
