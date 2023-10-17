import React, { Fragment, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAdminStore, useNotificationStore } from "../../zustand/GlobalStore";
import AdminNotificationPopper from "./AdminNotificationPopper";
import AxiosConnect from "../../utils/AxiosConnect";

const timeCalculator = (givenDate) => {
  // Parse the ISO date string into a Date object
  const parsedDate = new Date(givenDate);
  // Get the current date and time
  const currentDate = new Date();
  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - parsedDate;

  // Define time intervals in milliseconds
  const minuteInMilliseconds = 60 * 1000;
  const hourInMilliseconds = 60 * minuteInMilliseconds;
  const dayInMilliseconds = 24 * hourInMilliseconds;

  let timeAgo;
  // Determine the appropriate time format
  if (timeDifference < minuteInMilliseconds) {
    timeAgo = `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < hourInMilliseconds) {
    timeAgo = `${Math.floor(
      timeDifference / minuteInMilliseconds,
    )} minutes ago`;
  } else if (timeDifference < dayInMilliseconds) {
    timeAgo = `${Math.floor(timeDifference / hourInMilliseconds)} hours ago`;
  } else {
    timeAgo = `${Math.floor(timeDifference / dayInMilliseconds)} days ago`;
  }

  return timeAgo;
};

const AdminNotificationContent = ({ notification }) => {
  const { retrieveAndSetAllNotifications } = useNotificationStore();
  const adminCredentials = useAdminStore((state) => state.admin);
  let calculatedTime = timeCalculator(notification.createdDate);
  const [isPopperOpen, setPopperOpen] = useState(false);
  const [popperAnchorEl, setPopperAnchorEl] = useState(null);

  const backgroundColorStyle = {
    backgroundColor: notification.read ? "White" : "LightGrey",
  };

  const handlePopperToggle = (event) => {
    setPopperOpen(!isPopperOpen);
    setPopperAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setPopperOpen(false);
    setPopperAnchorEl(null);
  };

  const handleMarkAsRead = () => {
    AxiosConnect.patch(
      "/notification/updateNotificationAsRead",
      "",
      notification,
    );
    retrieveAndSetAllNotifications(adminCredentials);
    handleClosePopper();
  };

  const handleDelete = () => {
    AxiosConnect.patch("/notification/deleteNotification", "", notification);
    retrieveAndSetAllNotifications(adminCredentials);
    handleClosePopper();
  };

  return (
    <Card style={{ ...backgroundColorStyle, marginBottom: "4px" }}>
      <CardContent
        style={{
          display: "flex",
          alignItems: "flex-start", // Vertically align content to the top
          justifyContent: "space-between", // Create space between items
        }}
      >
        <div>
          <Typography variant="body2">{notification.title}</Typography>
          <Typography variant="body1">{notification.text}</Typography>
          <Typography variant="caption">{calculatedTime}</Typography>
        </div>
        <MoreHorizIcon
          onClick={handlePopperToggle}
          style={{ cursor: "pointer", flexDirection: "column" }}
        />
        <AdminNotificationPopper
          open={isPopperOpen}
          anchorEl={popperAnchorEl}
          onClose={handleClosePopper}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default AdminNotificationContent;
