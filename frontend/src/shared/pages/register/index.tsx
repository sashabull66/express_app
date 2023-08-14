import styles from "../login/style.module.css";
import {Typography} from "@alfalab/core-components/typography";
import {Gap} from "@alfalab/core-components/gap";
import {Input} from "@alfalab/core-components/input";
import {Button} from "@alfalab/core-components/button";
import {Link} from "@alfalab/core-components/link";
import React, {useState} from "react";
import {useAppDispatch} from "../../../store";
import {useNavigate} from "react-router-dom";
import {RegisterUser} from "../../../store/auth/action-creators";

export const Register = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        dispatch(RegisterUser({ email, name, role: 'user', password }, () => {
            navigate('/login');
        }))
    }

    return (
                <form onSubmit={onSubmitHandler} className={styles.wrapper}>
                    <Typography.TitleResponsive tag='h3' >Регистрация пользователя</Typography.TitleResponsive>
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
                        type={'text'}
                        block={true}
                        label='Имя'
                        size='xl'
                        onChange={e=>setName(e.target.value)}
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
                    <Typography.TitleResponsive tag='h5' view='small'>Уже есть учетная запись?</Typography.TitleResponsive>
                    <Link onClick={()=>navigate('/login')}>Войти</Link>
                </form>
    )
}