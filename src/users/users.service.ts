import {IUsersService} from "./users.service.interface.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UserEntity} from "./user.entity.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ConfigService} from "../config/config.service.js";
import {User, UserModel} from "./user.model.js";
import { DocumentType } from "@typegoose/typegoose/lib/types.js";

// Вся бизнес логика будет находиться здесь
@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}

    async createUser ({email, name, password}:UserRegisterDto): Promise<DocumentType<User> | null> {
        // Если пользователь в базе есть вернуть null иначе вернуть созданного пользователя
        const foundUser = await UserModel.findOne({email}).exec();

        if (!foundUser) {
            const newUser = new UserEntity(email, name)
            const salt = this.configService.get('SALT');

            await newUser.setPassword(password, salt)

            return await UserModel.create({
                email: newUser.email,
                name: newUser.name,
                password: newUser.password
            })
        } else {
            return null
        }
    }

    async removeUser (email?: string): Promise<DocumentType<User> | null> {
        const deletedUser = await UserModel.findOneAndRemove({email}).exec();

        if (deletedUser) {
            return deletedUser
        } else {
            return null
        }
    }

    async updateUser (userData:User): Promise<User | null> {
        const updUser = await UserModel.updateOne({_id: userData._id}, userData)

        if (updUser) {
            return userData
        } else {
            return null
        }
    }

    async getUsers ():Promise<DocumentType<User>[] | null> {
        return await UserModel.find().exec()
    }
}