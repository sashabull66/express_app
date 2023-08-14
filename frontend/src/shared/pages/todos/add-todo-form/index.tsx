import React, {useState} from "react";
import {CreateTodo} from "../../../../store/todos/action-creators";
import {useAppDispatch} from "../../../../store";
import {Typography} from "@alfalab/core-components/typography";
import {Gap} from "@alfalab/core-components/gap";
import {Input} from "@alfalab/core-components/input";
import {Button} from "@alfalab/core-components/button";

export const AddTodoForm = () => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        dispatch(CreateTodo({ title, description, done: false }))
        setTitle('');
        setDescription('');
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <Typography.TitleResponsive tag='h3' >Создание новой задачи</Typography.TitleResponsive>
            <Gap size='m' />
            <Input
                value={title}
                required={true}
                type={"text"}
                block={true}
                label='Title'
                size='xl'
                onChange={e=>setTitle(e.target.value)}
            />
            <Gap size='m' />
            <Input
                value={description}
                required={true}
                type={"text"}
                block={true}
                label='Description'
                size='xl'
                onChange={e=>setDescription(e.target.value)}
            />
            <Gap size='m' />
            <Button
                size={'xl'}
                view={'primary'}
                type={"submit"}
            >
                Создать
            </Button>
        </form>
    )
}