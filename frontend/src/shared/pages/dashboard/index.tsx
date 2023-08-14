import React from "react";
import {Grid} from "@alfalab/core-components/grid";
import {Typography} from "@alfalab/core-components/typography";

export const Dashboard = () => {
    return (
        <Grid.Row align='top'>
            <Grid.Col align='middle'>
                <Typography.Title color='negative' tag={"h1"} >Dashboard page</Typography.Title>
            </Grid.Col>
        </Grid.Row>
    )
}