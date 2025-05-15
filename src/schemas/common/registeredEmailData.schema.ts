import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})
export class RegisteredEmailData {
    @Prop({ required: true, type: String })
    regEmail: string;

    @Prop({ type: String })
    regEmailRefreshToken?: string

    @Prop({ type: String })
    regEmailPicture?: string

    @Prop({ type: String })
    regEmailName?: string

}

export type RegisteredEmailDataModel = RegisteredEmailData & Document
export const REGISTERED_EMAIL_DATA_MODEL = RegisteredEmailData.name
export const RegisteredEmailDataSchema = SchemaFactory.createForClass(RegisteredEmailData);