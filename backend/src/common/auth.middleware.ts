import {IMiddleware} from "./middleware.interface.js";
import {NextFunction, Request, Response} from "express";
import {UserSessionModel} from "../users/user-session.model.js";
import {IFingerprint} from "../types.js";
import moment from "moment-timezone";

export class AuthMiddleware implements IMiddleware {
    async execute (req: Request, res: Response, next: NextFunction): Promise<void> {
        const sessionId = req.cookies.session_id;
        if (sessionId) {
            const foundUserBySessionId = await UserSessionModel.findOne({sessionId}).exec()

            if (foundUserBySessionId) {
                const {userId, email, role, fingerprint} = foundUserBySessionId;

                const isValidClient = this.compareClientFingerprint(fingerprint, req)
                if (!isValidClient) {
                    console.log('Выявлена подозрительная активность аккаунта');
                    await UserSessionModel.findOneAndRemove({sessionId}).exec();
                } else {
                    req.user = {
                        email,
                        role,
                        userId
                    }
                }
            }
            next();

        } else {
            next();
        }
    }

    private compareClientFingerprint (fingerprint: IFingerprint, req: Request):boolean {
        const currentFingerprint: IFingerprint = {
            ip: req.headers['x-forwarded-for'] as string,
            userAgent: req.headers['user-agent'] as string,
            acceptLanguage: req.headers['accept-language'] as string,
            timezone: moment.tz.guess(),
        }

        return fingerprint.ip === currentFingerprint.ip &&
            fingerprint.acceptLanguage === currentFingerprint.acceptLanguage &&
            fingerprint.timezone === currentFingerprint.timezone &&
            fingerprint.userAgent === currentFingerprint.userAgent

    }
}