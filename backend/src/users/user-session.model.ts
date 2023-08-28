import {getModelForClass, prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses.js";
import 'reflect-metadata'
import {IFingerprint} from "../types.js";

export interface UserSession extends Base {}

class FingerPrint implements IFingerprint {
    @prop()
    ip: string

    @prop()
    userAgent: string

    @prop()
    acceptLanguage: string

    @prop()
    timezone: string
}

export class UserSession extends TimeStamps {
    @prop()
    email: string;

    @prop()
    userId: string;

    @prop()
    name: string;

    @prop()
    role: 'admin' | 'user';

    @prop()
    sessionId: string;

    @prop({ type: FingerPrint, _id: false })
    fingerprint: FingerPrint;
}

export const UserSessionModel = getModelForClass(UserSession);