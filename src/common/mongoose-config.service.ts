import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private config: ConfigService) { }

    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        const uri = this.config.get("MONGODB_URI")
        return {
            uri
        }
    }
}