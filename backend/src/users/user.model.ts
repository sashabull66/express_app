import {getModelForClass, prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses.js";
import 'reflect-metadata'

export interface User extends Base {}

export class User extends TimeStamps {
    @prop({ unique: true })
    public email: string;

    @prop()
    public name: string;

    @prop()
    public role: 'admin' | 'user';

    @prop()
    public password: string;
}

export const UserModel = getModelForClass(User);