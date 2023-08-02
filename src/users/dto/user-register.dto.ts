import {IsEmail, IsNumber, IsString} from "class-validator";

export class UserRegisterDto {
    @IsEmail({}, { message: 'Email указан не верно' })
    email: string
    @IsString({ message:'Не указан пароль' })
    password: string
    @IsString({message:'Не указано имя'})
    name: string
}