import React from "react";
import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";

const DetailsField = ({ params, isLoading }) => {
  const theme = useTheme();
  const details =
    params.row.actionHistory?.[params.row.actionHistory.length - 1];
  if (!details || isLoading) {
    return <Typography>Loading...</Typography>;
  } else {
    const actionTimeStamp = new Date(details.actionTimestamp).toLocaleString();
    const statusActions = {
      CONFIRMED: "Confirmed",
      REJECTED: "Rejected",
      CANCELLED: "Cancelled",
      PAID: "Updated to Paid",
    };
    const action = statusActions[details.newStatus];
    return (
      <div style={{ display: "flex" }}>
        <Typography>
          {action} by
          <span
            style={{
              fontWeight: "bold",
              color: theme.palette.dark_purple.main,
            }}
          >
            {" "}
            {details.actionByUserType} {details.actionByUserName}{" "}
          </span>{" "}
          on {actionTimeStamp}
        </Typography>
      </div>
    );
  }
};

export default DetailsField;
