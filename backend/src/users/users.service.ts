import {inject, injectable} from "inversify";
import {TYPES} from "../types.js";
import {ConfigService} from "../config/config.service.js";
import {DocumentType} from "@typegoose/typegoose/lib/types.js";
import {IUsersService} from "./users.service.interface.js";
import {User, UserModel} from "./user.model.js";
import {UserEntity} from "./user.entity.js";
import {UserRegisterDto} from "./dto/user-register.dto.js";
import {UserLoginDto} from "./dto/user-login.dto.js";
import 'reflect-metadata'
import {SaveTokenDto} from "./dto/save-token.dto.js";
import {Token, TokenModel} from "./token.model.js";
import {Types} from "mongoose";

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}


    async saveToken ({refreshToken, userId}:SaveTokenDto): Promise<DocumentType<Token> | null> {
        const prevToken = await TokenModel.findOne({ userId }).exec();

        if (prevToken) {
            prevToken.refreshToken = refreshToken
            return await prevToken.save()
        }

        return await TokenModel.create({
            userId, refreshToken
        })
    }

    async getRefreshToken (refreshToken: string): Promise<DocumentType<Token> | null> {
        const tokenData = await TokenModel.findOne({ refreshToken }).exec();

        return tokenData || null
    }

    async login ({ email }: Pick<UserLoginDto, 'email'>): Promise<DocumentType<User> | null> {
        const foundUser = await UserModel.findOne({ email }).exec();

        return foundUser || null
    };

    async getUserById (id: Types.ObjectId): Promise<DocumentType<User> | null> {
        const foundUser = await UserModel.findOne({ _id: id }).exec();

        return foundUser || null
    };

    async logout (id: Types.ObjectId): Promise<DocumentType<any> | null> {
        try {
            const deletedToken = await TokenModel.findOneAndRemove({ userId: id }).exec();

            return deletedToken || null
        } catch (e) {
            return  null
        }
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