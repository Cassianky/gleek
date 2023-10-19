import styled from "@emotion/styled";
import { Badge, Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useBookingStore from "../../../zustand/BookingStore";
import BookingsMonthView from "./BookingsMonthView";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PendingBookingsTable from "./PendingBookingsTable";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
}));

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

const BookingsPage = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState();
  const { getBookingsForVendor, bookings } = useBookingStore();

  const pendingBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING_CONFIRMATION"
  ).length;

  useEffect(() => {
    const fetchData = async () => {
      await getBookingsForVendor();
    };
    fetchData();
    setCurrentTab("calendar");
  }, [getBookingsForVendor]);

  const handleChange = (event, newVal) => {
    setCurrentTab(newVal);
  };
  return (
    <StyledPage>
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
        paddingLeft={2}
        paddingTop={2}
        paddingBottom={2}
      >
        Booking Management
      </Typography>
      <Box sx={{ paddingLeft: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="calendar" label="Calendar" icon={<CalendarMonthIcon />} />
          <Tab
            value="bookingsList"
            label=" New Bookings"
            icon={
              <StyledBadge badgeContent={pendingBookingBadgeNumber}>
                <NewReleasesIcon />
              </StyledBadge>
            }
          />
        </Tabs>
      </Box>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {currentTab === "calendar" && (
          <BookingsMonthView allBookings={bookings} />
        )}
        {currentTab === "bookingsList" && (
          <PendingBookingsTable allBookings={bookings} />
        )}
      </Box>
    </StyledPage>
  );
};

export default BookingsPage;
