import React from "react";
import styles from './index.module.css'
import {useAppDispatch, useAppSelector} from "../../../store";
import {LogoutUser} from "../../../store/auth/action-creators";
import {Grid} from "@alfalab/core-components/grid";
import {NavLink} from "react-router-dom";

export const Header = () => {
    const dispatch = useAppDispatch()

    const { profile } = useAppSelector(state => state.auth);

    const onClickHandler = () =>{
        dispatch(LogoutUser())
    }

    return (
        <Grid.Row className={styles.menu} justify='left'>
            <Grid.Col align='middle' className={styles.menuItem}>
                <NavLink to='/todos'>{profile?.role === 'admin' ? 'Все задачи' : 'Задачи'}</NavLink>
            </Grid.Col>
            { profile?.role === 'admin' &&
                <Grid.Col align='middle' className={styles.menuItem}>
                    <NavLink to='/admin'>Администрирование</NavLink>
                </Grid.Col>
            }
            <Grid.Col align='middle' className={styles.menuItem}>
                <div onClick={onClickHandler}>Выход</div>
            </Grid.Col>
        </Grid.Row>
    )
}