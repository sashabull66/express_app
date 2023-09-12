// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NextFunction, Request, Response } from 'express';

export interface IExceptionFilter {
  catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
