import { useNotificationStore } from "../zustand/NotficationStore";
import { useEffect, useState } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import NotificationList from "../components/Notifications/NotificationList";
import { useTheme } from "@emotion/react";
import useGlobalStore from "../zustand/GlobalStore";

const NotificationPage = () => {
  const { role } = useGlobalStore();
  const { notifications, loading, retrieveAndSetAllNotifications } =
    useNotificationStore();

  const theme = useTheme();

  useEffect(() => {
    // Fetch notifications when the component mounts
    retrieveAndSetAllNotifications(role);
  }, []);

  return (
    <div>
      <Typography
        marginLeft={2}
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        All Notifications
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
};

export default NotificationPage;
