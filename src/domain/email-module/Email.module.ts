import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataSchema } from 'src/schemas/common/registeredEmailData.schema';
import { USER_MODEL, UserSchema } from 'src/schemas/common/user.schema';
import { EMAIL_REFRESH_TOKENS_MODEL, emailRefreshTokenSchema } from 'src/schemas/OAuthEmailRefreshToken.schema';
import { OAUTH_TOKENS_MODEL, OAuthTokensSchema } from 'src/schemas/OAuthTokens.schema';
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataSchema } from 'src/schemas/UserRegisteredEmailsData.schema';
import { EmailService } from './email.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: REGISTERED_EMAIL_DATA_MODEL,
        useFactory: (configService: ConfigService) => {
          RegisteredEmailDataSchema.path('picture').default(
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
      {
        name: OAUTH_TOKENS_MODEL,
        useFactory: () => OAuthTokensSchema,
      },
      {
        name: EMAIL_REFRESH_TOKENS_MODEL,
        useFactory: () => emailRefreshTokenSchema,
      },
    ]),
  ],
  providers: [EmailService],
  exports: [MongooseModule],
})
export class EmailModule {}
