import { Logger } from 'tslog';
import { ILogger } from './logger.interface.js';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
  public logger: Logger<any>;

  constructor() {
    this.logger = new Logger({
      hideLogPositionForProduction: true,
      prettyLogTimeZone: 'local',
      type: 'pretty',
    });
  }

  public log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  public error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  public warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
