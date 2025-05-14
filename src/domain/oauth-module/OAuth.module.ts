import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataSchema } from 'src/schemas/common/registeredEmailData.schema';
import { USER_MODEL, UserSchema } from 'src/schemas/common/user.schema';
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataSchema } from 'src/schemas/UserRegisteredEmailsData.schema';

import { RedisModule } from '../redis/redis.module';

import { IsAuthenticatedUser } from 'src/middlewares/isAuthenticatedUser.middleware';
import { OAuthService } from './OAuth.service';
import { OAuthController } from './OAuth.controller';
import { OAuthUtilFunctions } from 'src/utils/OAuth.util';
import { MongooseUtilfn } from 'src/utils/Mongoose.util';
import { UserAuth } from 'src/middlewares/userAuth.middleware';
import { GmailServiceUtilFn } from 'src/utils/gmailClient.util';

@Module({
    imports: [
        RedisModule,
        MongooseModule.forFeatureAsync([
            {
                name: REGISTERED_EMAIL_DATA_MODEL,
                useFactory: (configService: ConfigService) => {
                    RegisteredEmailDataSchema.path('regEmailPicture').default(
                        configService.get<string>('DEFAULT_PROFILE_PIC'),
                    );
                    return RegisteredEmailDataSchema;
                },
                inject: [ConfigService],
            },
            {
                name: USER_MODEL,
                useFactory: () => UserSchema,
            },
            {
                name: USER_REG_EMAIL_DATA_MODEL,
                useFactory: () => UserRegisteredEmailsDataSchema,
            },

        ]),
    ],
    providers: [OAuthService, OAuthUtilFunctions, MongooseUtilfn, GmailServiceUtilFn],
    exports: [MongooseModule, OAuthService, MongooseUtilfn],
    controllers: [OAuthController],
})
export class OAuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(IsAuthenticatedUser)
            .forRoutes('api/email/google');

        consumer
            .apply(UserAuth)
            .forRoutes('api/email/refreshaccesstoken', 'api/email/deleteregisteredemail')

    }
}
