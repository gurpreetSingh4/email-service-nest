import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { REGISTERED_EMAIL_DATA_MODEL, RegisteredEmailDataSchema } from "src/schemas/common/registeredEmailData.schema";
import { USER_MODEL, UserSchema } from "src/schemas/common/user.schema";
import { EMAIL_REFRESH_TOKENS_MODEL, emailRefreshTokenSchema } from "src/schemas/OAuthEmailRefreshToken.schema";
import { OAUTH_TOKENS_MODEL, OAuthTokensSchema } from "src/schemas/OAuthTokens.schema";
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataSchema } from "src/schemas/UserRegisteredEmailsData.schema";

@Module({
    imports:[
        MongooseModule.forFeature(
            [
                {
                    name: USER_MODEL, schema:UserSchema
                },
                {
                    name: USER_REG_EMAIL_DATA_MODEL, schema:UserRegisteredEmailsDataSchema

                },
                {
                    name: OAUTH_TOKENS_MODEL, schema:OAuthTokensSchema

                },
                {
                    name: EMAIL_REFRESH_TOKENS_MODEL, schema:emailRefreshTokenSchema

                },
                {
                    name: REGISTERED_EMAIL_DATA_MODEL, schema:RegisteredEmailDataSchema

                },
            ]
        )
    ],
    providers: [],
    exports: [MongooseModule]

}) 
export class OAuthModule {

}