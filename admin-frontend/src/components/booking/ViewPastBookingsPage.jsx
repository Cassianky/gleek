import { useTheme } from "@emotion/react";
import { CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActivityStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import styled from "@emotion/styled";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CancelIcon from '@mui/icons-material/Cancel';

const ViewPastBookings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("completedAndPaid");

  const { activities, getActivity, isLoading, pendingApprovalActivities } =
    useActivityStore();
  useEffect(() => {
    const fetchData = async () => {
      await getActivity();
    };
    fetchData();
  }, [getActivity]);

  const handleChange = (event, newVal) => {
    setCurrentTab(newVal);
  };

  return (
      <MainBodyContainer
        hasBackButton={false}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"View Past Bookings"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          View Past Bookings
        </Typography>
        <Tabs value={currentTab} onChange={handleChange} centered>
            <Tab icon = {<EventAvailableIcon/>} value = "completedAndPaid" label="Completed and Paid" />
            <Tab icon = {<CancelIcon/>} value = "rejected" label="Rejected" />
            <Tab icon = {<EventBusyIcon/>} value = "cancelled" label="Cancelled" />
        </Tabs>
        {currentTab === "completedAndPaid" && (
          <div>paid</div>
        )}
        {currentTab === "rejected" && (
          <div>Ref</div>
        )}
        {currentTab === "cancelled" && (
          <div>cancelled</div>
        )}
      </MainBodyContainer>
  );
};

export default ViewPastBookings;
