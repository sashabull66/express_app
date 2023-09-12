import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { User } from './user.model.js';
import { Types } from 'mongoose';
import { UserSession } from './user-session.model.js';
import { UserSessionDto } from './dto/user-session.dto.js';

export interface IUsersService {
  login: (dto: UserLoginDto) => Promise<DocumentType<User> | null>;
  getUserById: (id: Types.ObjectId) => Promise<DocumentType<User> | null>;
  register: (dto: UserRegisterDto) => Promise<DocumentType<any> | null>;
  createSession: (dto: UserSessionDto) => Promise<DocumentType<UserSession> | null>;
  logout: (id: Types.ObjectId) => Promise<DocumentType<any> | null>;
  updateUserData: (newUserData: User) => Promise<DocumentType<any> | null>;
  removeUser: (id: Types.ObjectId) => Promise<DocumentType<any> | null>;
  getUsers: () => Promise<DocumentType<User>[] | null>;
}
