import { Injectable, Logger } from "@nestjs/common";
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataModel } from "src/schemas/common/registeredEmailData.schema";
import { USER_MODEL, UserDocument } from "src/schemas/common/user.schema";
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataModel } from "src/schemas/UserRegisteredEmailsData.schema";

import { RedisService } from "../redis/redis.service";

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        @InjectModel(USER_REG_EMAIL_DATA_MODEL) private readonly emailModel: Model<UserRegisteredEmailsDataModel>,
        @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
        @InjectModel(REGISTERED_EMAIL_DATA_MODEL) registeredEmailDataModel: Model<RegisteredEmailDataModel>,

    ) { }

    // async getUserInfo(accessToken: string) {
    //     try {
    //         const userInfoEndpoint = this.configService.get('USER_INFO_ENDPOINT');
    //         if (!userInfoEndpoint) {
    //             throw new Error('USER_INFO_ENDPOINT is not defined');
    //         }
    //         const { data } = await axios.get(userInfoEndpoint, {
    //             headers: { Authorization: `Bearer ${accessToken}` },
    //         });
    //         return data;
    //     } catch (error) {
    //         this.logger.error('Error fetching user info', error?.response?.data);
    //         throw error;
    //     }
    // }

    // async getTokens(code: string) {
    //     try {
    //         const { data } = await axios.post(
    //             this.configService.get('TOKEN_ENDPOINT') || (() => { throw new Error('TOKEN_ENDPOINT is not defined'); })(),
    //             null,
    //             {
    //                 params: {
    //                     code,
    //                     client_id: this.configService.get('GOOGLE_CLIENT_ID'),
    //                     client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
    //                     redirect_uri: `${this.configService.get('EMAIL_SERVICE_URL')}/api/email/google/callback`,
    //                     grant_type: 'authorization_code',
    //                 },
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                 },
    //             },
    //         );
    //         return {
    //             ...data,
    //             expires_at: Date.now() + data.expires_in * 1000,
    //         };
    //     } catch (error) {
    //         this.logger.error('Error exchanging code for tokens', error?.response?.data);
    //         throw error;
    //     }
    // }


    // async refreshToken(refreshToken: string) {
    //     try {
    //         const { data } = await axios.post(
    //             this.configService.get('TOKEN_ENDPOINT') || (() => { throw new Error('TOKEN_ENDPOINT is not defined'); })(),
    //             new URLSearchParams({
    //                 client_id: this.configService.get('GOOGLE_CLIENT_ID') || '',
    //                 client_secret: this.configService.get('GOOGLE_CLIENT_SECRET') || '',
    //                 refresh_token: refreshToken,
    //                 grant_type: 'refresh_token',
    //             }),
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                 },
    //             },
    //         );
    //         return data;
    //     } catch (error) {
    //         this.logger.error('Error in refreshToken()', error?.response?.data);
    //         throw error;
    //     }
    // }
    // async getGoogleOAuthUrl(): Promise<string> {
    //     const query = new URLSearchParams(
    //         Object.entries({
    //             redirect_uri: `${this.configService.get('EMAIL_SERVICE_URL')}/api/email/google/callback`,
    //             client_id: this.configService.get('GOOGLE_CLIENT_ID') || '',
    //             response_type: 'code',
    //             scope: [
    //                 'https://mail.google.com/',
    //                 'https://www.googleapis.com/auth/userinfo.email',
    //                 'https://www.googleapis.com/auth/userinfo.profile',
    //             ].join(' '),
    //             access_type: 'offline',
    //             prompt: 'consent',
    //         })
    //     );
    //     return `${this.configService.get('OAUTH_ROOT_URL')}?${query.toString()}`;
    // }







    // async finalizeOAuth(userId: string, code: string, session: Record<string, any>): Promise<{ redirectUrl: string }> {
    //     const tokens = await this.getTokens(code);
    //     const userInfo = await this.getUserInfo(tokens.access_token);
    //     const { sub, name, email, picture } = userInfo;

    //     const existingEmailEntry = await this.emailModel.findOne(
    //         { 'registeredEmailsData.email': email },
    //         { registeredEmailsData: { $elemMatch: { email } } },
    //     );

    //     if (
    //         existingEmailEntry &&
    //         existingEmailEntry.registeredEmailsData?.[0]?.emailRefreshToken
    //     ) {
    //         const encryptedRefreshToken = existingEmailEntry.registeredEmailsData[0].emailRefreshToken;
    //         const previousRefreshToken = decryptToken(encryptedRefreshToken);
    //         const refreshed = await this.refreshToken(previousRefreshToken);
    //         session.regEmail = email;

    //         await this.redisService.set(
    //             `${process.env.AUTHEMAILACCESSTOKENREDIS}:${userId}:${email}`,
    //             refreshed.access_token,
    //             3599,
    //         );

    //         return {
    //             redirectUrl: `${process.env.VITE_FRONTEND_URL}/oauthgmail/callback?success=true&regemail=${email}&userid=${userId}`,
    //         };
    //     }

    //     const encryptedEmailRefreshToken = encryptToken(tokens.refresh_token);
    //     const existing = await this.emailModel.findOne({ user: userId });

    //     if (existing) {
    //         await this.emailModel.updateOne(
    //             { user: userId },
    //             {
    //                 $push: {
    //                     registeredEmailsData: {
    //                         email,
    //                         emailRefreshToken: encryptedEmailRefreshToken,
    //                         name,
    //                         picture,
    //                         sub,
    //                     },
    //                 },
    //             },
    //         );
    //     } else {
    //         await this.emailModel.create({
    //             user: userId,
    //             registeredEmailsData: [
    //                 {
    //                     email,
    //                     emailRefreshToken: encryptedEmailRefreshToken,
    //                     name,
    //                     picture,
    //                     sub,
    //                 },
    //             ],
    //         });
    //     }

    //     await this.redisService.set(
    //         `${process.env.AUTHEMAILACCESSTOKENREDIS}:${userId}:${email}`,
    //         tokens.access_token,
    //         3599,
    //     );

    //     session.regEmail = email;

    //     return {
    //         redirectUrl: `${process.env.VITE_FRONTEND_URL}/oauthgmail/callback?success=true&regemail=${email}&userid=${userId}`,
    //     };
    // }

    // async refreshAccessToken(userid: string, regemail: string) {
    //     const emailDoc = await this.emailModel.findOne(
    //         { 'registeredEmailsData.email': regemail },
    //         { registeredEmailsData: { $elemMatch: { email: regemail } } },
    //     );

    //     if (!emailDoc || !emailDoc.registeredEmailsData?.[0]) {
    //         throw new Error('Email not found in DB');
    //     }

    //     const refreshTokenEncrypted = emailDoc.registeredEmailsData[0].emailRefreshToken;
    //     const currentUserName = emailDoc.registeredEmailsData[0].name;
    //     const previousRefreshToken = decryptToken(refreshTokenEncrypted);

    //     const { access_token } = await this.refreshToken(previousRefreshToken);

    //     await this.redisService.set(
    //         `${process.env.AUTHEMAILACCESSTOKENREDIS}:${userid}:${regemail}`,
    //         access_token,
    //         3599,
    //     );

    //     await this.redisService.set(`${process.env.CURRENTEMAILTOKENREDIS}`, regemail, 3599);
    //     await this.redisService.set(`${process.env.CURRENTNAMETOKENREDIS}`, currentUserName, 3599);

    //     return {
    //         success: true,
    //         message: `Access Token for ${regemail} refreshed`,
    //         user: userid,
    //         regEmail: regemail,
    //     };
    // }

    // async removeRegisteredEmailByUser(userId: string, regemail: string) {
    //     const result = await this.emailModel.findOneAndUpdate(
    //         { user: userId },
    //         {
    //             $pull: { registeredEmailsData: { email: regemail } },
    //         },
    //         { new: true },
    //     );

    //     if (!result) {
    //         throw new Error('User not found or email not registered');
    //     }

    //     return {
    //         success: true,
    //         message: 'Email entry removed successfully',
    //         data: result,
    //     };
    // }

}
