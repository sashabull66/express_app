import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {User} from "./user.model.js";
import {Token} from "./token.model.js";
import {Types} from "mongoose";

export interface IUsersService {
    login: (dto: UserLoginDto) => Promise<DocumentType<User> | null>;
    getUserById: (id: Types.ObjectId) => Promise<DocumentType<User> | null>
    register: (dto: UserRegisterDto) => Promise<DocumentType<any> | null>;
    saveToken: (token: Token) => Promise<DocumentType<Token> | null>;
    getRefreshToken: (token: Token['refreshToken']) => Promise<DocumentType<Token> | null>;
    logout: (id: Types.ObjectId) => Promise<DocumentType<any> | null>;
    updateUserData: (newUserData: User) => Promise<DocumentType<any> | null>;
    removeUser: (id: Types.ObjectId) => Promise<DocumentType<any> | null>;
    getUsers: () => Promise<DocumentType<User>[] | null>;
}
