import { BadRequestException, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { RedisService } from "src/domain/redis/redis.service";
@Injectable()
export class IsAuthenticatedUser implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisClient: RedisService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const verifyUrl = req.originalUrl.split("?")[0]
        if (verifyUrl !== '/api/email/google') {
            return next(); // Skip logic for other paths
        }
        try {
            const { userid, regemail } = req.query
            if (!userid) {
                Logger.error('Missing userid in query parameters')
                res.status(401).json({
                    success: false,
                    message: "Missing userid in query parameters"
                })
            }
            if (!regemail) {
                Logger.error('Missing regemail in query parameters')
                res.status(401).json({
                    success: false,
                    message: "Missing regemail in query parameters"
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
            req.session['regEmail'] = regemail
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