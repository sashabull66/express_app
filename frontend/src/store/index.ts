import {configureStore} from "@reduxjs/toolkit";
import logger from "redux-logger";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import AuthReducer from "./auth/auth-reducer";
import TodosReducer from "./todos/todos-reducer";

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        todos: TodosReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(...(
            process.env.NODE_ENV !== 'production' ? [logger] : []
    ))
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;