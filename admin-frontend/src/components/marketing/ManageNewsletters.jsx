import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import {
    CircularProgress, Tabs, Tab,
  Typography,
} from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import InfoIcon from "@mui/icons-material/Info";
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import SendIcon from '@mui/icons-material/Send';

const ManageNewsletters = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("scheduled");
  const isLoading = false;
  //const { isLoading, newsletters, getAllNewsletters } = useBookingStore();

//   const pendingBookingBadgeNumber = bookings.filter(
//     (booking) => booking.status === "PENDING_CONFIRMATION",
//   ).length;

//   const confirmedBookingBadgeNumber = bookings.filter(
//     (booking) => booking.status === "CONFIRMED",
//   ).length;

//   const pendingPaymentBookingBadgeNumber = bookings.filter(
//     (booking) => booking.status === "PENDING_PAYMENT",
//   ).length;

//   const pendingConfirmationAdditionalColumns = [
//     {
//       field: "creationDateTime",
//       headerName: "Booked on",
//       type: "dateTime",
//       flex: 2,
//       valueGetter: (params) => {
//         const dateString = params.row.creationDateTime;
//         return new Date(dateString);
//       },
//     },
//     {
//       field: "confirmAction",
//       headerName: "Confirm?",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => {
//         return <ConfirmField bookingData={params.row} />;
//       },
//     },
//   ];

//   const confirmedAdditionalColumns = [
//     {
//       field: "details",
//       headerName: "Confirmation Details",
//       flex: 2,
//       sortable: false,
//       renderCell: (params) => {
//         return <DetailsField params={params} isLoading={isLoading} />;
//       },
//     },
//     {
//       field: "cancelAction",
//       headerName: "Cancel?",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => {
//         return <CancelField bookingData={params.row} />;
//       },
//     },
//   ];

//   const pendingPaymentAdditionalColumns = [
//     {
//       field: "downloadInvoice",
//       headerName: "Invoice",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => {
//         return <InvoiceDownloadButton />;
//       },
//     },
//     {
//       field: "paidAction",
//       headerName: "Paid?",
//       flex: 1,
//       sortable: false,
//       renderCell: (params) => {
//         return <PaidField bookingData={params.row} />;
//       },
//     },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       await getAllNewsletters();
//     };
//     fetchData();
//   }, [getAllNewsletters]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("testing")
    };
    fetchData();
  }, []);

  const handleChange = (event, newVal) => {
    setCurrentTab(newVal);
  };

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Newsletters"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Newsletters
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
          <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
          <Typography color="#9F91CC">
            Schedule newsletters to be sent to clients subscribed to the mailing list.
          </Typography>
        </div>
        <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab
          icon={
              <ScheduleSendIcon />
          }
          value="scheduled"
          label="Scheduled"
        />
        <Tab
        icon={
          <SendIcon />
      }
          value="sent"
          label="Sent"
        />
        <Tab
        icon={
          <CancelScheduleSendIcon />
      }
          value="failed"
          label="Failed"
        />
      </Tabs>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <>
          {currentTab === "scheduled" && (
            <></>
            // <BookingsTable
            //   bookings={bookings}
            //   //status="SCHEDULED"
            //   //additionalColumns={pendingConfirmationAdditionalColumns}
            // />
          )}
          {currentTab === "sent" && (
            <></>
            // <BookingsTable
            //   bookings={bookings}
            //   //status="SENT"
            //   //additionalColumns={confirmedAdditionalColumns}
            // />
          )}
          {currentTab === "failed" && (
            <></>
            // <BookingsTable
            //   bookings={bookings}
            //   //status="FAILED"
            //   //additionalColumns={pendingPaymentAdditionalColumns}
            // />
          )}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ManageNewsletters;
