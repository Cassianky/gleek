import { useTheme } from "@emotion/react";
import { CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import BookingsTable from "./BookingsTable";
import ConfirmField from "./ConfirmField";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CancelIcon from "@mui/icons-material/Cancel";

const ViewPastBookings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("completedAndPaid");
  const { isLoading, bookings, getAllBookings, approveBooking, rejectBooking } =
    useBookingStore();
  const { openSnackbar } = useSnackbarStore();

  const completedAndPaidAdditionalColumns = [
    {
        field: "details",
        headerName: "Payment Update Details",
        flex: 2,
        sortable: false,
        renderCell: (params) => {
          return (
            <Typography>Updated by admin xx on xx</Typography>
          );
        },

    }
  ];

  const rejectedAdditionalColumns = [
    {
        field: "details",
        headerName: "Rejection Details",
        flex: 2,
        sortable: false,
        renderCell: (params) => {
          return (
            <Typography>Rejected by admin xx on xx</Typography>
          );
        },

    }
  ]

  const cancelledAdditionalColumns = [
    {
        field: "details",
        headerName: "Cancellation Details",
        flex: 2,
        sortable: false,
        renderCell: (params) => {
          return (
            <Typography>Cancelled by admin xx on xx</Typography>
          );
        },

    }
  ]


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
      <Tab
          icon={<EventAvailableIcon />}
          value="completedAndPaid"
          label="Completed and Paid"
        />
        <Tab icon={<CancelIcon />} value="rejected" label="Rejected" />
        <Tab icon={<EventBusyIcon />} value="cancelled" label="Cancelled" />
      </Tabs>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <>
          {currentTab === "completedAndPaid" && (
            <BookingsTable
              bookings={bookings}
              status="PAID"
              additionalColumns={completedAndPaidAdditionalColumns}
            />
          )}
          {currentTab === "rejected" && (
            <BookingsTable
              bookings={bookings}
              status="REJECTED"
              additionalColumns={rejectedAdditionalColumns}
            />
          )}
          {currentTab === "cancelled" && (
            <BookingsTable
              bookings={bookings}
              status="CANCELLED"
              additionalColumns={cancelledAdditionalColumns}
            />)}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ViewPastBookings;
