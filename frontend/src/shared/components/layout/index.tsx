import React from "react";
import {useAppSelector} from "../../../store";
import {Header} from "../header";

type Props = {
    children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({children}) => {
    const { profile } = useAppSelector(state => state.auth);

    return (
        <div>
            {profile && <Header/>}
            {children}
        </div>
    )
}