import { Logger } from 'tslog'

export class LoggerService {
    public logger:Logger<any>;

    constructor() {
        this.logger = new Logger({
            hideLogPositionForProduction: true,
            prettyLogTimeZone: 'local',
            type: 'pretty',
        });
    }

    public log (...args:unknown[]) {
        this.logger.info(...args);
    }

    public error (...args:unknown[]) {
        this.logger.error(...args);
    }

    public warn (...args:unknown[]) {
        this.logger.warn(...args);
    }
}