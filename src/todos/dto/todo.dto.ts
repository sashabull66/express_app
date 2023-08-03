import {IsBoolean, IsString} from "class-validator";
import 'reflect-metadata'

export class TodoDto {
    @IsString({ message: 'Title указан не верно' })
    title: string;
    @IsString({ message:'Не указано описание задачи' })
    description: string;
    @IsBoolean()
    done: boolean;
}