import { BadRequestException, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { RedisService } from "src/domain/redis/redis.service";
@Injectable()
export class UserAuth implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisClient: RedisService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        
        try {
            const { userid } = req.query
            if (!userid) {
                Logger.error('Missing userid inside query parameter')
                res.status(401).json({
                    success: false,
                    message: "Missing userid in query parameters"
                })
            }
            
            const redisAccessToken = this.configService.get('AUTHACCESSTOKENREDIS')
            const redisKey = `${redisAccessToken}:${userid}`
            const jwtToken = await this.redisClient.get(redisKey)
            if (!jwtToken) {
                Logger.warn(`Token not found in Redis for key: ${redisKey}`);
                return res.status(401).json({
                    success: false,
                    message: "Authentication token not found",
                });
            }
            const jwtSecret = this.configService.get<string>("JWT_SECRET");
            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not defined in the configuration");
            }
            const tokenData = jwt.verify(jwtToken, jwtSecret);
            req.session['user'] = tokenData;
            req.session['regEmail'] = ''
            return next()

        } catch (err) {
            Logger.error(`JWT verification failed: ${err.message}`);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token",
            });
        }
    }
}