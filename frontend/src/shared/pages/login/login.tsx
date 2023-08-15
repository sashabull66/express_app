import React, {useEffect, useState} from "react";
import {Input} from "@alfalab/core-components/input";
import {Gap} from "@alfalab/core-components/gap";
import {Typography} from "@alfalab/core-components/typography";
import {Button} from "@alfalab/core-components/button";

import styles from "./style.module.css";
import {useAppDispatch, useAppSelector} from "../../../store";
import {LoginUser} from "../../../store/auth/action-creators";
import {useNavigate} from "react-router-dom";
import {Link} from "@alfalab/core-components/link";
import {Grid} from "@alfalab/core-components/grid";

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile } = useAppSelector(s => s.auth)

    useEffect(() => {
        if (profile) {
            const prevPath = window.localStorage.getItem('prevPath')
            if (prevPath?.includes('login') || prevPath?.includes('register')) {
                navigate('/dashboard');
            } else {
                navigate(prevPath || '/dashboard');
            }

            prevPath && window.localStorage.removeItem('prevPath')
        }
    }, [profile])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }, () => {
        }))
    }

    return (
        <Grid.Row>
            <Grid.Col></Grid.Col>
            <Grid.Col align={"middle"}>
                <form onSubmit={onSubmitHandler} className={styles.wrapper}>
                    <Typography.TitleResponsive tag='h3' >Введите учетные данные</Typography.TitleResponsive>
                    <Gap size='m' />
                    <Input
                        required={true}
                        type={"email"}
                        block={true}
                        label='Email'
                        size='xl'
                        onChange={e=>setEmail(e.target.value)}
                    />
                    <Gap size='m' />
                    <Input
                        required={true}
                        type={"password"}
                        block={true}
                        label='Пароль'
                        size='xl'
                        onChange={e=>setPassword(e.target.value)}
                    />
                    <Gap size='m' />
                    <Button
                        size={'xl'}
                        view={'primary'}
                        type={"submit"}
                    >
                        Отправить
                    </Button>
                    <Gap size='s' />
                    <Typography.TitleResponsive tag='h5' view='small'>Нету учетной записи?</Typography.TitleResponsive>
                    <Link onClick={()=>navigate('/register')}>Регистрация</Link>
                </form>
            </Grid.Col>
            <Grid.Col></Grid.Col>
        </Grid.Row>
    )
}