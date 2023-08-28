import { v4 as uuidv4 } from 'uuid';
import {Types} from "mongoose";
import {IFingerprint} from "../types.js";

export class UserSessionEntity {
    private readonly _sessionId: string

    constructor(
        private readonly _email: string,
        private readonly _fingerPrint: IFingerprint,
        private readonly _name: string,
        private readonly _id: Types.ObjectId,
        private readonly _role: 'admin' | 'user'
    ) {
        this._sessionId = uuidv4()
    }

    get email(): string {
        return this._email
    }

    get name(): string {
        return this._name
    }

    get userId(): Types.ObjectId {
        return this._id
    }

    get role(): 'admin' | 'user' {
        return this._role
    }

    get sessionId(): string {
        return this._sessionId
    }

    get fingerprint(): IFingerprint {
        return this._fingerPrint
    }
}