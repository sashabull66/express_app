import {IsEmail, IsString} from "class-validator";
import 'reflect-metadata'

export class UserRegisterDto {
    @IsEmail({}, { message: 'Email указан не верно' })
    email: string
    @IsString({ message:'Не указан пароль' })
    password: string
    @IsString({message:'Не указано имя'})
    name: string
    @IsString({message:'Не указана роль пользователя'})
    role: 'admin' | 'user'
}