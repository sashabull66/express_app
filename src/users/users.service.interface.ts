import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {User} from "./user.model.js";

export interface IUsersService {
    login: (dto: UserLoginDto) => Promise<DocumentType<User> | null>;
    register: (dto: UserRegisterDto) => Promise<DocumentType<any> | null>;
    // verifyUser: (email: string, password: string) => Promise<DocumentType<User> | null>;
}
