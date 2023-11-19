import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Badge, Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import useBookingStore from "../../../zustand/BookingStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import BookingsMonthView from "./BookingsMonthView";
import BookingsTable from "./BookingsTable";
import CancelField from "./CancelField";
import ConfirmField from "./ConfirmField";
import DetailsField from "./DetailsField";

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

  const cancelledBadgeNumber = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;

  const rejectedBadgeNumber = bookings.filter(
    (booking) => booking.status === "REJECTED",
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
        const today = Date.now();
        const bookingDate = new Date(params.row?.startDateTime);
        const timeDifference = bookingDate - today;
        let canCancel = true;
        if (timeDifference >= 0 && timeDifference <= 14 * 24 * 60 * 60 * 1000) {
          canCancel = false;
        }
        return canCancel && <CancelField bookingData={params.row} />;
      },
    },
  ];

  const cancelledAdditionalColumns = [
    {
      field: "details",
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Cancellation Details
          </Typography>
        );
      },
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params.row} />;
      },
    },
  ];

  const rejectedAdditionalColumns = [
    {
      field: "details",
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Rejection Details
          </Typography>
        );
      },
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params.row} />;
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
          <Tab
            icon={
              <StyledBadge
                color={currentTab === "cancelled" ? "error" : "unselected"}
                badgeContent={cancelledBadgeNumber}
              >
                <EventBusyIcon />
              </StyledBadge>
            }
            value="cancelled"
            label="Cancelled"
          />
          <Tab
            icon={
              <StyledBadge
                color={currentTab === "rejected" ? "error" : "unselected"}
                badgeContent={rejectedBadgeNumber}
              >
                <CancelIcon />
              </StyledBadge>
            }
            value="rejected"
            label="Rejected"
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
            canCancel={false}
          />
        )}
        {currentTab === "completedAndPaid" && (
          <BookingsTable
            allBookings={bookings}
            status={["PAID", "PENDING_PAYMENT"]}
            additionalColumns={completedAndPaidAdditionalColumns}
            canCancel={false}
          />
        )}
        {currentTab === "confirmed" && (
          <BookingsTable
            allBookings={bookings}
            status={["CONFIRMED"]}
            additionalColumns={confirmedAdditionalColumns}
            canCancel={true}
          />
        )}
        {currentTab === "cancelled" && (
          <BookingsTable
            allBookings={bookings}
            status={["CANCELLED"]}
            additionalColumns={cancelledAdditionalColumns}
            canCancel={false}
          />
        )}
        {currentTab === "rejected" && (
          <BookingsTable
            allBookings={bookings}
            status={["REJECTED"]}
            additionalColumns={rejectedAdditionalColumns}
            canCancel={false}
          />
        )}
      </Box>
    </StyledPage>
  );
};

export default BookingsPage;
