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
import {TodoModel} from "../todos/todo.model.js";

@injectable()
export class UsersService implements IUsersService {
    constructor(
        @inject(TYPES.ConfigService)
        private readonly configService: ConfigService
    ) {}
    async saveToken ({ refreshToken, userId}:SaveTokenDto): Promise<DocumentType<Token> | null> {
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
        try {
            const tokenData = await TokenModel.findOne({ refreshToken }).exec();

            return tokenData || null
        } catch (e) {
            return null
        }
    }

    async login ({ email }: Pick<UserLoginDto, 'email'>): Promise<DocumentType<User> | null> {
        try {
            const foundUser = await UserModel.findOne({ email }).exec();

            return foundUser || null
        } catch (e) {
            return null
        }
    };

    async getUserById (id: Types.ObjectId): Promise<DocumentType<User> | null> {
        try {
            const foundUser = await UserModel.findOne({ _id: id }).exec();

            return foundUser || null
        } catch (e) {
            return null
        }
    };

    async logout (id: Types.ObjectId): Promise<DocumentType<any> | null> {
        try {
            const deletedToken = await TokenModel.findOneAndRemove({ userId: id }).exec();

            return deletedToken || null
        } catch (e) {
            return  null
        }
    };

    async updateUserData (newUserData: User): Promise<DocumentType<any> | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(newUserData._id, newUserData).exec();

            return updatedUser || null
        } catch (e) {
            return  null
        }
    };

    async removeUser (id: Types.ObjectId): Promise<DocumentType<any> | null> {
        try {
            await TokenModel.findOneAndRemove({ userId: id }).exec();
            await TodoModel.deleteMany({ userId: id }).exec()
            const deletedUser = await UserModel.findOneAndRemove({ _id: id }).exec();

            return deletedUser || null
        } catch (e) {
            return  null
        }
    };

    async getUsers (): Promise<DocumentType<User>[] | null> {
        try {
            return await UserModel.find({}, { _id: 1, name: 1, role: 1, email: 1 });
        } catch (e) {
            return null
        }
    }

    async register ({ email, name, role, password }: UserRegisterDto): Promise<DocumentType<User> | null> {
        try {
            const foundUser = await UserModel.findOne({ email }).exec();

            if (!foundUser) {
                const newUser = new UserEntity(email, name, role)
                const salt = this.configService.get('SALT');

                await newUser.setPassword(password, salt)

                return await UserModel.create(newUser.data)
            } else {
                return null
            }
        } catch (e) {
            return null
        }
    };
}