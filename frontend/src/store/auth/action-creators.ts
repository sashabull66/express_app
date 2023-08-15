import {ILoginRequest, IRegisterRequest} from "../../api/auth/types";
import {Dispatch} from "@reduxjs/toolkit";
import {loginFailure, loginStart, loginSuccess, logoutSuccess} from "./auth-reducer";
import api from "../../api";

export const LoginUser = (params: ILoginRequest, callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch(loginStart());
        const result = await api.auth.Login(params);

        dispatch(loginSuccess(result.data))
        localStorage.setItem('token', result.data.access_token)

        if (callback) callback();
        
    } catch (e: any) {
        dispatch(loginFailure(e.message))
    }
}

export const RegisterUser = (params: IRegisterRequest, callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch(loginStart());
        await api.auth.Register(params);

        if (callback) callback();

    } catch (e: any) {
        dispatch(loginFailure(e.message))
    }
}

export const LogoutUser = (callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        await api.auth.Logout();

        dispatch(logoutSuccess())
        localStorage.removeItem('token')

        if (callback) callback();
    } catch (e: any) {
        console.error(e.response?.data?.message)
    }
}

export const RefreshUserData = (callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch(loginStart());
        const result = await api.auth.Refresh();

        localStorage.setItem('token', result.data.access_token)
        dispatch(loginSuccess(result.data))

        if (callback) callback();

    } catch (e: any) {
        dispatch(loginFailure(e.message))
    }
}