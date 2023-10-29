import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import {
  convertISOtoShortDate,
  convertISOtoTime,
} from "../../../utils/TimeFormatter";

const DetailsField = ({ params }) => {
  const theme = useTheme();
  const details = params?.actionHistory?.[params?.actionHistory.length - 1];

  const actionTimeStampDate = convertISOtoShortDate(details?.actionTimestamp);
  const actionTimeStampTime = convertISOtoTime(details?.actionTimestamp);
  const statusActions = {
    CONFIRMED: "Confirmed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    PAID: "Updated to Paid",
  };

  const action = statusActions[details?.newStatus];
  return (
    params.actionHistory &&
    details && (
      <div style={{ display: "flex" }}>
        <Typography fontSize={"0.875rem"}>
          {action} by
          <span
            style={{
              color: theme.palette.light_purple.main,
            }}
          >
            {" "}
            {details?.actionByUserType} {details?.actionByUserName}{" "}
          </span>{" "}
          on {actionTimeStampDate} at {actionTimeStampTime}
        </Typography>
      </div>
    )
  );
};

export default DetailsField;
