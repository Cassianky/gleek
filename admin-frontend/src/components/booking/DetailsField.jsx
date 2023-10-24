import React from "react";
import { Typography } from "@mui/material";

const DetailsField = ({ params, isLoading }) => {
    const details = params.row.actionHistory[params.row.actionHistory.length - 1];
    const actionTimeStamp = new Date (details.actionTimestamp).toLocaleString();
    console.log(details)
    if (isLoading) {
        return <Typography>Loading...</Typography>;
    } else {
    return (
    <div style={{ whiteSpace: 'normal', display: "flex" }}>
        <Typography>
            {details.actionByAdmin} {details.actionType} on {actionTimeStamp}
        </Typography>
    </div>
    );
    }
}

export default DetailsField;