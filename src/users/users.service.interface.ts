import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";

export interface IUsersService {
    login: (dto: UserLoginDto) => Promise<DocumentType<any> | null>;
    register: (dto: UserRegisterDto) => Promise<DocumentType<any> | null>;
}
