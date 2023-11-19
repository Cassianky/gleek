import { useTheme } from "@emotion/react";
import { CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import BookingsTable from "./BookingsTable";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CancelIcon from "@mui/icons-material/Cancel";
import DetailsField from "./DetailsField";

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
        return <DetailsField params={params} isLoading={isLoading} />;
      },
    },
  ];

  const rejectedAdditionalColumns = [
    {
      field: "details",
      headerName: "Rejection Details",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params} isLoading={isLoading} />;
      },
    },
  ];

  const cancelledAdditionalColumns = [
    {
      field: "details",
      headerName: "Cancellation Details",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return <DetailsField params={params} isLoading={isLoading} />;
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAllBookings();
    };
    fetchData();
  }, [getAllBookings]);

  const getSortedBookings = (status) => {
    const filteredBookings = bookings.filter((booking) => booking.status === status);
    console.log(bookings);

    
    // Sort the bookings based on the timestamp of the last action in actionHistory
    const sortedBookings = filteredBookings.sort((a, b) => {
      const lastActionA = a.actionHistory[a.actionHistory.length - 1];
      const lastActionB = b.actionHistory[b.actionHistory.length - 1];
      return new Date(lastActionB?.actionTimestamp) - new Date(lastActionA?.actionTimestamp);
    });
  
    return sortedBookings;
  };

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
              bookings={getSortedBookings("PAID")}
              status="PAID"
              additionalColumns={completedAndPaidAdditionalColumns}
            />
          )}
          {currentTab === "rejected" && (
            <BookingsTable
              bookings={getSortedBookings("REJECTED")}
              status="REJECTED"
              additionalColumns={rejectedAdditionalColumns}
            />
          )}
          {currentTab === "cancelled" && (
            <BookingsTable
              bookings={getSortedBookings("CANCELLED")}
              status="CANCELLED"
              additionalColumns={cancelledAdditionalColumns}
            />
          )}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ViewPastBookings;
