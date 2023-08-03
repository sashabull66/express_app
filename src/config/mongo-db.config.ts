import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ConfigService} from "./config.service.js";
import * as mongoose from "mongoose";
import {ILogger} from "../logger/logger.interface.js";

@injectable()
export class MongoDbConfig {
    constructor(
        @inject(TYPES.ConfigService) private configService: ConfigService,
        @inject(TYPES.ILogger) private logger: ILogger,
        ) {}

    private getMongoUri ():string {
        return  "mongodb://" +
            this.configService.get("MONGO_LOGIN") +
            ":" +
            this.configService.get("MONGO_PASSWORD") +
            "@" +
            this.configService.get("MONGO_HOST") +
            ":" +
            this.configService.get("MONGO_PORT") +
            "/" +
            this.configService.get("MONGO_AUTH_DB");
    }

    public async connectToDB (): Promise<void> {
        const dbUri: string = this.getMongoUri();
        try {
            await mongoose.connect(dbUri);
            this.logger.log(`Connected to DB SUCCESSFULLY [DB-URI] ${dbUri}`)
        } catch (e) {
            this.logger.error(e)
        }
    }
}