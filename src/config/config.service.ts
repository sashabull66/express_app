import {IConfigService} from "./config.service.interface.js";
import {config, DotenvConfigOutput, DotenvParseOutput} from 'dotenv'
import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ILogger} from "../logger/logger.interface.js";

@injectable()
export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();

        if (result.error) {
            this.logger.error('Не удалось прочитать файл .env или он отсутствует')
        } else if (result.parsed) {
            this.config = result.parsed
        }
    }

    get (key: string): string {
        return this.config[key]
    }
}