import React from "react";

import styles from "./style.module.css";
import {Header} from "./header";
import {useAppSelector} from "../../store";

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