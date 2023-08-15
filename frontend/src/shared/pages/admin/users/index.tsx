import React from "react";
import {AllUsers} from "./all-users";
import {RemoveUserForm} from "./remove-user";

export const Users = () => {

    return (
        <>
            <div>users</div>
            <AllUsers/>
            <RemoveUserForm/>
        </>
    )
}