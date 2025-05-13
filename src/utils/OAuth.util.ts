import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios'

@Injectable()
export class OAuthUtilFunctions {
        private readonly logger = new Logger(OAuthUtilFunctions.name);
    
    constructor(
        private readonly configService: ConfigService,

    ) { }

    async getUserInfo(accessToken: string) {
        try {
            const userInfoEndpoint = this.configService.get<string>('USER_INFO_ENDPOINT');
            if (!userInfoEndpoint) {
                throw new Error('USER_INFO_ENDPOINT is not defined in the configuration');
            }
            const { data } = await axios.get(userInfoEndpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return data;
        } catch (error) {
            this.logger.error("Error fetching user info:", error.response?.data);
            new BadRequestException(error.response?.data || 'Failed to fetch user info')
        }
    }

    async getTokens(code: string) {
        try {
            const { data } = await axios.post(
                this.configService.get('TOKEN_ENDPOINT') || (() => { throw new Error('TOKEN_ENDPOINT is not defined'); })(),
                null,
                {
                    params: {
                        code,
                        client_id: this.configService.get('GOOGLE_CLIENT_ID'),
                        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
                        redirect_uri: `${this.configService.get('EMAIL_SERVICE_URL')}/api/email/google/callback`,
                        grant_type: 'authorization_code',
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
            return {
                ...data,
                expires_at: Date.now() + data.expires_in * 1000,
            };
        } catch (error) {
            this.logger.error('Error exchanging code for tokens', error?.response?.data);
            throw error;
        }
    }


       async refreshToken(refreshToken: string) {
        try {
            const { data } = await axios.post(
                this.configService.get('TOKEN_ENDPOINT') || (() => { throw new Error('TOKEN_ENDPOINT is not defined'); })(),
                new URLSearchParams({
                    client_id: this.configService.get('GOOGLE_CLIENT_ID') || '',
                    client_secret: this.configService.get('GOOGLE_CLIENT_SECRET') || '',
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
            return data;
        } catch (error) {
            this.logger.error('Error in refreshToken()', error?.response?.data);
            throw error;
        }
    }
    async getGoogleOAuthUrl(): Promise<string> {
        const query = new URLSearchParams(
            Object.entries({
                redirect_uri: `${this.configService.get('EMAIL_SERVICE_URL')}/api/email/google/callback`,
                client_id: this.configService.get('GOOGLE_CLIENT_ID') || '',
                response_type: 'code',
                scope: [
                    'https://mail.google.com/',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ].join(' '),
                access_type: 'offline',
                prompt: 'consent',
            })
        );
        return `${this.configService.get('OAUTH_ROOT_URL')}?${query.toString()}`;
    }

}