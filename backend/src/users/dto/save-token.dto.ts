import {IsString} from "class-validator";
import 'reflect-metadata'
import {Types} from "mongoose";

export class SaveTokenDto {
    @IsString()
    userId: Types.ObjectId

    @IsString()
    refreshToken: string
}