import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ConfigService} from "../config/config.service.js";
import { DocumentType } from "@typegoose/typegoose/lib/types.js";
import {IUsersService} from "./users.service.interface.js";
import {User, UserModel} from "./user.model.js";
import {UserEntity} from "./user.entity.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import 'reflect-metadata'

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}

    async login ({email, password}: UserLoginDto): Promise<DocumentType<UserLoginDto> | null> {
        const foundUser = await UserModel.findOne({ email, password }).exec();

        return foundUser || null
    };

    async register ({ email, name, role, password }: UserRegisterDto): Promise<DocumentType<User> | null> {
        const foundUser = await UserModel.findOne({ email }).exec();

        if (!foundUser) {
            const newUser = new UserEntity(email, name, role)
            const salt = this.configService.get('SALT');

            await newUser.setPassword(password, salt)

            return await UserModel.create({
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                password: newUser.password
            })
        } else {
            return null
        }
    };
}