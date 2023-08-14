import {getModelForClass, prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses.js";
import 'reflect-metadata'
import {Types} from "mongoose";

export interface Token extends Base {}

export class Token extends TimeStamps {
    @prop({ unique: true })
    public userId: Types.ObjectId;

    @prop()
    public refreshToken: string;
}

export const TokenModel = getModelForClass(Token);