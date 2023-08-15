import {Dispatch} from "@reduxjs/toolkit";
import {getUsersFailure, getUsersStart, getUsersSuccess, removeUsersData} from "./admin-reducer";
import api from "../../api";

export const GetAllUsers = (callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch(getUsersStart());
        const result = await api.auth.GetUsers();

        dispatch(getUsersSuccess(result.data))

        if (callback) callback();
        
    } catch (e: any) {
        dispatch(getUsersFailure(e.message))
    }
}

export const RemoveUser = (usrId:string, callback?: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch(getUsersStart());
        await api.auth.RemoveUser(usrId);
        const result = await api.auth.GetUsers();

        dispatch(getUsersSuccess(result.data))

        if (callback) callback();

    } catch (e: any) {
        dispatch(getUsersFailure(e.message))
    }
}
