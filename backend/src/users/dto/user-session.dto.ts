import { Types } from 'mongoose';
import { IFingerprint } from '../../types.js';

export class UserSessionDto {
  sessionId: string;
  userId: Types.ObjectId;
  email: string;
  name: string;
  role: 'admin' | 'user';
  fingerprint: IFingerprint;
}
