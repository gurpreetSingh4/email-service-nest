import { BadGatewayException, BadRequestException, Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataModel } from "src/schemas/common/registeredEmailData.schema";
import { USER_MODEL, UserDocument } from "src/schemas/common/user.schema";
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataModel } from "src/schemas/UserRegisteredEmailsData.schema";

import { RedisService } from "../redis/redis.service";
import { Request, Response } from "express";
import { OAuthUtilFunctions } from "src/utils/OAuth.util";
import { MongooseUtilfn } from "src/utils/Mongoose.util";
import { decryptToken, encryptToken } from "src/utils/crypto.util";

@Injectable()
export class OAuthService {
    private readonly logger = new Logger(OAuthService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private oAuthUtilFn: OAuthUtilFunctions,
        private mongooseUtilFn: MongooseUtilfn,
        @InjectModel(USER_REG_EMAIL_DATA_MODEL) private readonly userRegEmailsModel: Model<UserRegisteredEmailsDataModel>,
        @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
        @InjectModel(REGISTERED_EMAIL_DATA_MODEL) registeredEmailDataModel: Model<RegisteredEmailDataModel>,

    ) { }

    async finalizeOAuth(req: Request, res: Response, session: Record<string, any>) {
        try {
            const code = req.query.code as string;
            if (!code) {
                this.logger.warn('Authorization code not provided');
                return res.status(400).json({
                    success: false,
                    message: 'Authorization code not provided',
                });
            }

            const tokens = await this.oAuthUtilFn.getTokens(code);
            if (!tokens) {
                this.logger.warn('Failed to get tokens');
                return res.status(500).json({
                    success: false,
                    message: 'Failed to get tokens',
                });
            }


            // const userId = req.session?.user?.userId;
            const userId = req['session']?.['user']?.['userId'] ?? null;

            if (!userId) {
                this.logger.warn('User ID not found in session');
                return res.status(401).json({
                    success: false,
                    message: 'User ID not found in session',
                });
            }

            const userInfo = await this.oAuthUtilFn.getUserInfo(tokens.access_token);
            if (!userInfo) {
                this.logger.warn('Failed to get user info in email module');
                return res.status(500).json({
                    success: false,
                    message: 'Failed to get user info in email module',
                });
            }

            const { name: regEmailName, email: regEmail, picture: regEmailPicture } = userInfo;

            const existedRegUser = await this.mongooseUtilFn.findRegisteredEmailData(userId, regEmail)
            if (existedRegUser) {
                const getEncryptRefreshToken = existedRegUser.regEmailRefreshToken
                const getDecryptRefreshToken = decryptToken(getEncryptRefreshToken as string)
                const { access_token } = await this.oAuthUtilFn.refreshToken(getDecryptRefreshToken)
                req.session['regEmail'] = regEmail;
                await this.redisService.set(
                    `${this.configService.get('AUTHEMAILACCESSTOKENREDIS')}:${userId}:${regEmail}`,
                    access_token
                )
                return res.redirect(
                    `${this.configService.get('VITE_FRONTEND_URL')}/oauthgmail/callback?success=true&regemail=${regEmail}&userid=${userId}`
                );
                // return res.json({
                //     success: true
                // })
            }
            const encyptRefreshToken = encryptToken(tokens.refresh_token)
            const newEntryData: {
                regEmail: string;
                regEmailName?: string;
                regEmailRefreshToken?: string;
                regEmailPicture?: string;
            } = {
                regEmail,
                regEmailName,
                regEmailRefreshToken: encyptRefreshToken,
                regEmailPicture,
            }
            await this.mongooseUtilFn.upsertRegisteredEmailData(userId, newEntryData)
            req.session['regEmail'] = regEmail;
            await this.redisService.set(
                `${this.configService.get('AUTHEMAILACCESSTOKENREDIS')}:${userId}:${regEmail}`,
                tokens.access_token
            )
            return res.redirect(
                `${this.configService.get('VITE_FRONTEND_URL')}/oauthgmail/callback?success=true&regemail=${regEmail}&userid=${userId}`
            );
            // return res.json({
            //     success: true
            // })
        }
        catch (error) {
            this.logger.error(error)
            new BadRequestException(error.response?.data)
        }

    }

    async refreshAccToken(req: Request, res: Response, session: Record<string, any>) {
        try {
            const { userid, regemail } = req.query;
            console.log(userid, regemail, "h yha")
            if (!userid || !regemail) {
                return res.status(400).json({
                    success: false,
                    message: "userid , regemail not found in query parameter",
                });
            }

            const existedUser = await this.mongooseUtilFn.findRegisteredEmailData(userid as string, regemail as string)
            if (!existedUser) {
                return new BadGatewayException("user is not found for refresh access token")
            }
            const getEncryptRefreshToken = existedUser.regEmailRefreshToken
            const getDecryptRefreshToken = decryptToken(getEncryptRefreshToken as string)
            const { access_token } = await this.oAuthUtilFn.refreshToken(getDecryptRefreshToken)
            req.session['regEmail'] = regemail;
            await this.redisService.set(
                `${this.configService.get('AUTHEMAILACCESSTOKENREDIS')}:${userid}:${regemail}`,
                access_token
            )
            return res.redirect(
                `${this.configService.get('VITE_FRONTEND_URL')}/oauthgmail/callback?success=true&regemail=${regemail}&userid=${userid}`
            );
            // return res.json({
            //     success: true
            // })
        } catch (error) {
            return new BadRequestException("Error during refresh access Token")
        }

    }
    async deleteRegEmail(req: Request, res: Response, session: Record<string, any>) {
        try {
            const { userid, regemail } = req.query;
            console.log(userid, regemail, "h yha")
            if (!userid || !regemail) {
                return res.status(400).json({
                    success: false,
                    message: "userid , regemail not found in query parameter",
                });
            }

            const existedUser = await this.mongooseUtilFn.findRegisteredEmailData(userid as string, regemail as string)
            if (!existedUser) {
                return new BadGatewayException("user is not found for refresh access token")
            }
            await this.mongooseUtilFn.removeRegisteredEmailData(userid as string, regemail as string)
            res.status(200).json({
                success: true,
                message: "Email entry removed successfully",
            });
        } catch (error) {
            return new BadRequestException("error during delete Registered Email")
        }

    }
}