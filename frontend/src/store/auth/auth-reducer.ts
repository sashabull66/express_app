import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ILoginResponse} from "../../api/auth/types";

export interface IAuthState {
        profile: {
            name: string;
            email: string;
            role: 'admin' | 'user'
        } | null;
        isLoading: boolean;
        error: string | null

}

export const initialState: IAuthState = {
        profile: null,
        isLoading: true,
        error: null
}

const AuthReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state)=>({
            ...state,
            isLoading: true

        }),
        loginSuccess: (state, action: PayloadAction<ILoginResponse>)=>({
            ...state,
            isLoading: false,
            error: null,
            profile: {
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role
            }
        }),
        loginFailure: (state, action: PayloadAction<string>)=>({
            ...state,
            isLoading: false,
            error: action.payload,
        }),
        logoutSuccess: ():IAuthState => initialState
    }
})

export const {
    loginSuccess,
    logoutSuccess,
    loginStart,
    loginFailure
} = AuthReducer.actions;

export default AuthReducer.reducer;