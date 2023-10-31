import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ConfirmField from "./ConfirmField";
import CancelField from "./CancelField";
import { Badge, Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useBookingStore from "../../../zustand/BookingStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import BookingsMonthView from "./BookingsMonthView";
import BookingsTable from "./BookingsTable";
import DetailsField from "./DetailsField";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

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
  },
}));

const BookingsPage = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState();
  const { getBookingsForVendor, bookings, approveBooking, rejectBooking } =
    useBookingStore();
  const { openSnackbar } = useSnackbarStore();

  const pendingBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING_CONFIRMATION",
  ).length;

  const completedAndPaidBadgeNumber = bookings.filter((booking) =>
    ["PAID", "PENDING_PAYMENT"].includes(booking.status),
  ).length;

  const confirmedBadgeNumber = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
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

  const pendingConfirmationAdditionalColumns = [
    {
      field: "approve",
      type: "actions",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Approve?
          </Typography>
        );
      },
      renderCell: (params) => {
        return <ConfirmField bookingData={params.row} />;
      },
    },
  ];
  const completedAndPaidAdditionalColumns = [
    {
      field: "status",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Paid?
          </Typography>
        );
      },
      renderCell: (params) => {
        return params.row.status === "PAID" ? <DoneIcon /> : <CloseIcon />;
      },
    },
  ];
  const confirmedAdditionalColumns = [
    {
      field: "details",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Confirmation Details
          </Typography>
        );
      },
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params.row} />;
      },
    },
    {
      field: "cancelAction",
      align: "center",
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          ></Typography>
        );
      },
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return <CancelField bookingData={params.row} />;
      },
    },
  ];

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
              <StyledBadge
                badgeContent={pendingBookingBadgeNumber}
                color="light_green"
              >
                <NewReleasesIcon />
              </StyledBadge>
            }
          />
          <Tab
            icon={
              <StyledBadge
                color={
                  currentTab === "completedAndPaid"
                    ? "pale_purple"
                    : "unselected"
                }
                badgeContent={completedAndPaidBadgeNumber}
              >
                <EventAvailableIcon />
              </StyledBadge>
            }
            value="completedAndPaid"
            label="Completed"
          />
          <Tab
            icon={
              <StyledBadge
                color={
                  currentTab === "confirmed" ? "pale_purple" : "unselected"
                }
                badgeContent={confirmedBadgeNumber}
              >
                <ThumbUpAltIcon />
              </StyledBadge>
            }
            value="confirmed"
            label="Confirmed"
          />
        </Tabs>
      </Box>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {currentTab === "calendar" && (
          <BookingsMonthView
            allBookings={bookings}
            approveBooking={approveBooking}
            rejectBooking={rejectBooking}
            openSnackbar={openSnackbar}
          />
        )}
        {currentTab === "bookingsList" && (
          <BookingsTable
            allBookings={bookings}
            status={["PENDING_CONFIRMATION"]}
            additionalColumns={pendingConfirmationAdditionalColumns}
          />
        )}
        {currentTab === "completedAndPaid" && (
          <BookingsTable
            allBookings={bookings}
            status={["PAID", "PENDING_PAYMENT"]}
            additionalColumns={completedAndPaidAdditionalColumns}
          />
        )}
        {currentTab === "confirmed" && (
          <BookingsTable
            allBookings={bookings}
            status={["CONFIRMED"]}
            additionalColumns={confirmedAdditionalColumns}
          />
        )}
      </Box>
    </StyledPage>
  );
};

export default BookingsPage;
