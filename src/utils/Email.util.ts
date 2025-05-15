import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios'
import { RedisService } from "src/domain/redis/redis.service";

@Injectable()
export class EmailUtilFunctions {
    private readonly logger = new Logger(EmailUtilFunctions.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,

    ) { }
    async getAccessToken(userId: string, regEmail: string):Promise<string> {
        return await this.redisService.get(
            `${this.configService.get('AUTHEMAILACCESSTOKENREDIS')}:${userId}:${regEmail}`
        ) || (()=> {throw new Error("access token not found")})()
    }

}