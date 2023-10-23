import { useTheme } from "@emotion/react";
import { CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActivityStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import styled from "@emotion/styled";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewReleaseIcon from "@mui/icons-material/NewReleases";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PaidIcon from '@mui/icons-material/Paid';

const ViewActiveBookings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("calendar");

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
        currentBreadcrumbName={"View Active Bookings"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          View Active Bookings
        </Typography>
        <Tabs value={currentTab} onChange={handleChange} centered>
            <Tab icon = {<CalendarMonthIcon/>} value = "calendar" label="Calendar" />
            <Tab icon = {<NewReleaseIcon/>} value = "pendingConfirmation" label="Pending Confirmation" />
            <Tab icon = {<ThumbUpAltIcon/>} value = "confirmed" label="Confirmed" />
            <Tab icon = {<PaidIcon/>} value = "pendingPayment" label="Pending Payment" />
        </Tabs>
        {currentTab === "calendar" && (
          <div>Calendar</div>
        )}
        {currentTab === "pendingConfirmation" && (
          <div>Pending Conf</div>
        )}
        {currentTab === "confirmed" && (
          <div>Conf</div>
        )}
        {currentTab === "pendingPayment" && (
          <div>Pending payment</div>
        )}
      </MainBodyContainer>
  );
};

export default ViewActiveBookings;
