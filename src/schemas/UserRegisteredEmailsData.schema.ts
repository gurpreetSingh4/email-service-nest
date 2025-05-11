import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User, USER_MODEL } from "./common/user.schema";
import { RegisteredEmailData, RegisteredEmailDataSchema } from "./common/registeredEmailData.schema";

@Schema({
    timestamps: true
})
export class UserRegisteredEmailsData {

    @Prop({ required: true, type: Types.ObjectId, ref: USER_MODEL })
    user: string | Types.ObjectId | User;

    @Prop({ type: [RegisteredEmailDataSchema], default: [] })
    registeredEmailsData: RegisteredEmailData[];
}
export const USER_REG_EMAIL_DATA_MODEL = UserRegisteredEmailsData.name

export const UserRegisteredEmailsDataSchema = SchemaFactory.createForClass(UserRegisteredEmailsData);