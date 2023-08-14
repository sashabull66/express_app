import {AxiosPromise} from "axios";

export interface ILoginRequest {
    email: string,
    password: string
}

export interface IRegisterRequest {
    email: string,
    name: string,
    role: string
    password: string,
}

export interface ILoginResponse {
    access_token: string,
    email: string,
    role: 'admin' | 'user',
    name: string,
}

export interface IRegisterResponse {
    email: string,
    role: 'admin' | 'user',
    name: string,
}

export interface ILogin {
    (params:ILoginRequest):AxiosPromise<ILoginResponse>
}

export interface IRegister {
    (params:IRegisterRequest):AxiosPromise<IRegisterResponse>
}