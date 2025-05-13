import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { USER_ROLE } from "src/constants/user.constants";

@Schema({
    timestamps: true
})
export class User {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String })
    oAuthSub: string

    @Prop({  type: String })
    profilePicture?: string

    @Prop({ enum: Object.keys(USER_ROLE), default: USER_ROLE.GUEST })
    role?: string

    @Prop({ type: Date, default: Date.now })
    createdAt?: Date

}

export type UserDocument = User & Document
export const USER_MODEL = User.name
export const UserSchema = SchemaFactory.createForClass(User);