import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Badge, CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PaidIcon from "@mui/icons-material/Paid";
import BookingsTable from "./BookingsTable";
import ConfirmField from "./ConfirmField";
import CancelField from "./CancelField";
import PaidField from "./PaidField";
import InvoiceDownloadButton from "./InvoiceDownloadButton";
import DetailsField from "./DetailsField";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
    backgroundColor: theme.palette.light_purple.main,
  },
}));

const ViewActiveBookings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("pendingConfirmation");
  const {
    isLoading,
    bookings,
    getAllBookings,
    approveBooking,
    rejectBooking,
    cancelBooking,
    updateBookingToPaid,
  } = useBookingStore();
  const { openSnackbar } = useSnackbarStore();

  const pendingBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING_CONFIRMATION",
  ).length;

  const confirmedBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const pendingPaymentBookingBadgeNumber = bookings.filter(
    (booking) => booking.status === "PENDING_PAYMENT",
  ).length;

  const pendingConfirmationAdditionalColumns = [
    {
      field: "creationDateTime",
      headerName: "Booked on",
      type: "dateTime",
      flex: 2,
      valueGetter: (params) => {
        const dateString = params.row.creationDateTime;
        return new Date(dateString);
      },
    },
    {
      field: "confirmAction",
      headerName: "Confirm?",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <ConfirmField
            params={params}
            approveBooking={approveBooking}
            rejectBooking={rejectBooking}
            openSnackbar={openSnackbar}
            isLoading={isLoading}
          />
        );
      },
    },
  ];

  const confirmedAdditionalColumns = [
    {
      field: "details",
      headerName: "Confirmation Details",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params} isLoading={isLoading} />;
      },
    },
    {
      field: "downloadInvoice",
      headerName: "",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        return <InvoiceDownloadButton />;
      },
    },
    {
      field: "cancelAction",
      headerName: "Cancel?",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <CancelField
            params={params}
            cancelBooking={cancelBooking}
            openSnackbar={openSnackbar}
          />
        );
      },
    },
  ];

  const pendingPaymentAdditionalColumns = [
    {
      field: "paidAction",
      headerName: "Paid?",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <PaidField
            params={params}
            openSnackbar={openSnackbar}
            updateBookingToPaid={updateBookingToPaid}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAllBookings();
    };
    fetchData();
  }, [getAllBookings]);

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
        <Tab
          icon={
            <StyledBadge badgeContent={pendingBookingBadgeNumber}>
              <NewReleasesIcon />
            </StyledBadge>
          }
          value="pendingConfirmation"
          label="Pending Confirmation"
        />
        <Tab
          icon={
            <StyledBadge badgeContent={confirmedBookingBadgeNumber}>
              <ThumbUpAltIcon />
            </StyledBadge>
          }
          value="confirmed"
          label="Confirmed"
        />
        <Tab
          icon={
            <StyledBadge badgeContent={pendingPaymentBookingBadgeNumber}>
              <PaidIcon />
            </StyledBadge>
          }
          value="pendingPayment"
          label="Pending Payment"
        />
      </Tabs>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <>
          {currentTab === "calendar" && <div>cal</div>}
          {currentTab === "pendingConfirmation" && (
            <BookingsTable
              bookings={bookings}
              status="PENDING_CONFIRMATION"
              additionalColumns={pendingConfirmationAdditionalColumns}
            />
          )}
          {currentTab === "confirmed" && (
            <BookingsTable
              bookings={bookings}
              status="CONFIRMED"
              additionalColumns={confirmedAdditionalColumns}
            />
          )}
          {currentTab === "pendingPayment" && (
            <BookingsTable
              bookings={bookings}
              status="PENDING_PAYMENT"
              additionalColumns={pendingPaymentAdditionalColumns}
            />
          )}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ViewActiveBookings;
