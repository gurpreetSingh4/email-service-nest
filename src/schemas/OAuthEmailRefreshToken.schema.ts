import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User, USER_MODEL } from "./common/user.schema";

@Schema({
    timestamps: true
})
export class emailRefreshToken {

    @Prop({ required: true, type: Types.ObjectId, ref: USER_MODEL })
    user: string | Types.ObjectId | User;

    @Prop({ type: String, required: true })
    refreshToken: string;

    @Prop({ type: Date, default: Date.now })
    expiresAt?: Date;

}
export const EMAIL_REFRESH_TOKENS_MODEL = emailRefreshToken.name

export const emailRefreshTokenSchema = SchemaFactory.createForClass(emailRefreshToken);