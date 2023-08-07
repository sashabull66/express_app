import {IsEmail, isEmail, IsString} from "class-validator";
import 'reflect-metadata'

export class UserLoginDto {
    @IsEmail({}, { message: 'Email указан не верно' })
    email: string

    @IsString({ message:'Не указан пароль' })
    password: string
}