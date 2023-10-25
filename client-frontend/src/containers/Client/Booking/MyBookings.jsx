import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import useBookingStore from "../../../zustand/BookingStore";
import MyBookingsCalendarView from "./MyBookingsCalendarView";

const MyBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "calendar";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const { getPendingAndConfirmedBookingsForClient, bookings } =
    useBookingStore();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    // Update the query parameter with the selected tab
    setSearchParams({ tab: newValue });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPendingAndConfirmedBookingsForClient();
    };
    fetchData();
  }, [getPendingAndConfirmedBookingsForClient]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        My Bookings
      </Typography>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        centered
      >
        <Tab label="Calendar" value="calendar" />
        <Tab label="Upcoming" value="upcoming" />
        <Tab label="Pending" value="pending" />
        <Tab label="Past" value="past" />
        <Tab label="All" value="all" />
      </Tabs>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {selectedTab === "calendar" && (
          <MyBookingsCalendarView allBookings={bookings} />
        )}
      </Box>
    </Box>
  );
};

export default MyBookings;
