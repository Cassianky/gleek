import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box, Tab, Tabs, Typography, Badge } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import useBookingStore from "../../../zustand/BookingStore";
import MyBookingsCalendarView from "./MyBookingsCalendarView";
import CancelBookingsTable from "./CancelBookingsTable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from "@mui/icons-material/Paid";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
    backgroundColor: theme.palette.success.pastel,
  },
}));

const MyBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "calendar";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const { getAllBookingsForClient, bookings } = useBookingStore();

  const pendingBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING_CONFIRMATION",
  ).length;

  const upcomingBookingBadgeNumber = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED" &&
      new Date(booking.startDateTime) > new Date(),
  ).length;

  const completedBookingBadgeNumber = bookings.filter(
    (booking) =>
      booking.status === "PENDING PAYMENT" ||
      booking.status === "PAID" ||
      (booking.status === "CONFIRMED" &&
        new Date(booking.startDateTime) < new Date()),
  ).length;

  const rejectedOrCancelledBookingBadgeNumber = bookings.filter(
    (booking) =>
      booking.status === "REJECTED" || booking.status === "CANCELLED",
  ).length;

  const pendingPaymentBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING PAYMENT",
  ).length;

  const paidBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PAID",
  ).length;

  const pendingBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) => booking.status === "PENDING_CONFIRMATION",
    );

    return filteredBookings;
  };

  const upcomingBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED" &&
        new Date(booking.startDateTime) > new Date(),
    );
    return filteredBookings;
  };

  const completedBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.status === "PENDING PAYMENT" ||
        booking.status === "PAID" ||
        (booking.status === "CONFIRMED" &&
          new Date(booking.startDateTime) < new Date()),
    );
    return filteredBookings;
  };

  const rejectedOrCancelledBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.status === "REJECTED" || booking.status === "CANCELLED",
    );
    return filteredBookings;
  };

  const pendingPaymentBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) => booking.status === "PENDING PAYMENT",
    );
    return filteredBookings;
  };

  const paidBookingsFilter = (bookings) => {
    const filteredBookings = bookings.filter(
      (booking) => booking.status === "PAID",
    );
    return filteredBookings;
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    // Update the query parameter with the selected tab
    setSearchParams({ tab: newValue });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllBookingsForClient();
    };
    fetchData();
  }, [getAllBookingsForClient]);

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
        <Tab label="Calendar" value="calendar" icon={<CalendarMonthIcon />} />
        <Tab
          label="Pending Confirmation"
          value="pending confirmation"
          icon={
            <StyledBadge badgeContent={pendingBookingBadgeNumber}>
              <NewReleasesIcon />
            </StyledBadge>
          }
        />
        <Tab
          label="Upcoming"
          value="upcoming"
          icon={
            <StyledBadge badgeContent={upcomingBookingBadgeNumber}>
              <ScheduleIcon />
            </StyledBadge>
          }
        />
        <Tab
          label="Completed"
          value="completed"
          icon={
            <StyledBadge badgeContent={completedBookingBadgeNumber}>
              <CheckCircleIcon />
            </StyledBadge>
          }
        />
        <Tab
          label="Cancelled/Rejected"
          value="cancelled/rejected"
          icon={
            <StyledBadge badgeContent={rejectedOrCancelledBookingBadgeNumber}>
              <CancelIcon />
            </StyledBadge>
          }
        />
        <Tab
          label="Pending Payment"
          value="pending payment"
          icon={
            <StyledBadge badgeContent={pendingPaymentBookingBadgeNumber}>
              <PaymentIcon />
            </StyledBadge>
          }
        />
        <Tab
          label="Paid"
          value="paid"
          icon={
            <StyledBadge badgeContent={paidBookingBadgeNumber}>
              <PaidIcon />
            </StyledBadge>
          }
        />
      </Tabs>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {selectedTab === "calendar" && (
          <MyBookingsCalendarView allBookings={bookings} />
        )}
        {selectedTab === "pending confirmation" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={pendingBookingsFilter}
            hasCancel={true}
          />
        )}
        {selectedTab === "upcoming" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={upcomingBookingsFilter}
            hasCancel={true}
          />
        )}
        {selectedTab === "completed" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={completedBookingsFilter}
            hasCancel={false}
          />
        )}
        {selectedTab === "cancelled/rejected" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={rejectedOrCancelledBookingsFilter}
            hasCancel={false}
          />
        )}
        {selectedTab === "pending payment" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={pendingPaymentBookingsFilter}
            hasCancel={false}
          />
        )}
        {selectedTab === "paid" && (
          <CancelBookingsTable
            allBookings={bookings}
            filter={paidBookingsFilter}
            hasCancel={false}
          />
        )}
      </Box>
    </Box>
  );
};

export default MyBookings;
