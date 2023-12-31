import React, {useEffect} from "react";
import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {Login} from "./shared/pages/login/login";
import {useAppDispatch, useAppSelector} from "./store";
import {Dashboard} from "./shared/pages/dashboard";
import {Register} from "./shared/pages/register";
import {RefreshUserData} from "./store/auth/action-creators";
import {Todos} from "./shared/pages/todos";
import {AdminPage} from "./shared/pages/admin";
import {Users} from "./shared/pages/admin/users";
import {Todos as ATodos} from "./shared/pages/admin/todos";


const PrivateRoute = () => {
    const { profile } = useAppSelector(state => state.auth);
    const prevPath = window.location.pathname

    if (prevPath) {
        window.localStorage.setItem('prevPath', prevPath);
    }

    return profile ? <Outlet /> : <Navigate to="/login" />
}

const AdminRoute = () => {
    const { profile } = useAppSelector(state => state.auth);

    return profile?.role === 'admin' ? <Outlet /> : <Navigate to="/" />
}

export const Router = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            dispatch(RefreshUserData())
        }
    },[dispatch])

    return (
        <Routes>

            {/* Ниже роуты только для авторизованного пользака (в том числе и админ) */}
            <Route path='/' element={<PrivateRoute/>}>

                {/* Ниже роуты только для админа */}
                <Route path='/admin' element={<AdminRoute/>}>
                    <Route path='/admin' element={ <AdminPage/> }/>
                    <Route path='users' element={ <Users/> }/>
                    <Route path='todos' element={ <ATodos/> }/>
                </Route>

                <Route path='dashboard' element={ <Dashboard/> }/>
                <Route path='todos' element={ <Todos/> }/>
                <Route path='*' element={ <div>404 not found</div> } />
            </Route>

            {/* Ниже роуты для неавторизованного посетителя */}
            <Route path='/login' element={ <Login/> }/>
            <Route path='/register' element={ <Register/> }/>

        </Routes>
    )
}