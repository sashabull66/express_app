import {getModelForClass, prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses.js";

export interface User extends Base {}

export class User extends TimeStamps {
    @prop({unique:true})
    public email: string;

    @prop()
    public password: string;

    @prop()
    public name: string;
}

export const UserModel = getModelForClass(User);
