import React, {CSSProperties} from "react";
import {useNavigate} from "react-router-dom";
import {List} from "@alfalab/core-components/list";
import styles from './index.module.css'

export const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <List tag='ul' marker='•'>
            <List.Item><div className={styles.listItem} onClick={()=>navigate('users')}>Операции с пользователями</div></List.Item>
            <List.Item><div className={styles.listItem} onClick={()=>navigate('todos')}>Операции с задачами</div></List.Item>
            <List.Item>Пример элемента списка</List.Item>
            <List.Item>Пример элемента списка</List.Item>
            <List.Item>Пример элемента списка</List.Item>
        </List>
    )
}