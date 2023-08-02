import {UserRegisterDto} from "./dto/user-register.dto.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {User} from "./user.model.js";

export interface IUsersService {
    createUser: (dto:UserRegisterDto) => Promise<DocumentType<User> | null>
    removeUser: (email:string) => Promise<DocumentType<User> | null>
    updateUser: (userData: User) => Promise<User | null>
    getUsers: () => Promise<DocumentType<User>[] | null>
}
