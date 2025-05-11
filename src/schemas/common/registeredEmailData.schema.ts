import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { USER_ROLE } from "src/constants/user.constants";

@Schema({
    timestamps: true
})
export class RegisteredEmailData {
    @Prop({ required: true, type: String })
    email: string;

    @Prop({ type: String })
    emailRefreshToken?: string

    @Prop({ type: String })
    picture?: string

    @Prop({ type: String })
    name?: string;

    @Prop({ type: String })
    sub?: string;

}
export const REGISTERED_EMAIL_DATA_MODEL = RegisteredEmailData.name
export const RegisteredEmailDataSchema = SchemaFactory.createForClass(RegisteredEmailData);