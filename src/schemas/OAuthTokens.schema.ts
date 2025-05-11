import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { USER_ROLE } from "src/constants/user.constants";
import { User, USER_MODEL } from "./common/user.schema";

@Schema({
    timestamps: true
})
export class OAuthTokens {

    @Prop({ required: true, type: Types.ObjectId, ref: USER_MODEL })
    user: string | Types.ObjectId | User;

    @Prop({ type: String, required: true })
    id_token: string;

    @Prop({ required: true, type: String })
    scope: string;

    @Prop({ required: true, type: String })
    refresh_token: string

}
export const OAUTH_TOKENS_MODEL = OAuthTokens.name

export const OAuthTokensSchema = SchemaFactory.createForClass(OAuthTokens);