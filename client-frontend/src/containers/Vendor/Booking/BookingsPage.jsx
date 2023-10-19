import styled from "@emotion/styled";
import { Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import useBookingStore from "../../../zustand/BookingStore";
import BookingsMonthView from "./BookingsMonthView";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
}));

const BookingsPage = () => {
  const theme = useTheme();
  const { getBookingsForVendor, bookings } = useBookingStore();

  useEffect(() => {
    const fetchData = async () => {
      await getBookingsForVendor();
    };
    fetchData();
  }, [getBookingsForVendor]);
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
      <BookingsMonthView allBookings={bookings} />
    </StyledPage>
  );
};

export default BookingsPage;
