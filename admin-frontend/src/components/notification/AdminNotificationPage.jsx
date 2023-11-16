import { useAdminStore, useNotificationStore } from "../../zustand/GlobalStore";
import { useEffect, useState } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import AdminNotificationList from "./AdminNotificationList";
import MainBodyContainer from "../common/MainBodyContainer";
import { useTheme } from "@emotion/react";

const AdminNotificationPage = () => {
  const { notifications, loading, retrieveAndSetAllNotifications } =
    useNotificationStore();

  const theme = useTheme();

  useEffect(() => {
    // Fetch notifications when the component mounts
    retrieveAndSetAllNotifications();
  }, []);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"All Notifications"}
    >
      <Typography
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
        <AdminNotificationList notifications={notifications} />
      )}
    </MainBodyContainer>
  );
};

export default AdminNotificationPage;
