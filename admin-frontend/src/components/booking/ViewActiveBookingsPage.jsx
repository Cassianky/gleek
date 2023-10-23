import { useTheme } from "@emotion/react";
import { CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewReleaseIcon from "@mui/icons-material/NewReleases";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PaidIcon from "@mui/icons-material/Paid";
import BookingsTable from "./BookingsTable";
import ConfirmField from "./ConfirmField";
import InfoIcon from "@mui/icons-material/Info";

const ViewActiveBookings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("calendar");
  const { isLoading, bookings, getAllBookings, approveBooking, rejectBooking } =
    useBookingStore();
  const { openSnackbar } = useSnackbarStore();

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
        <Tab icon={<CalendarMonthIcon />} value="calendar" label="Calendar" />
        <Tab
          icon={<NewReleaseIcon />}
          value="pendingConfirmation"
          label="Pending Confirmation"
        />
        <Tab icon={<ThumbUpAltIcon />} value="confirmed" label="Confirmed" />
        <Tab
          icon={<PaidIcon />}
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
          {currentTab === "confirmed" && <div>Conf</div>}
          {currentTab === "pendingPayment" && <div>Pending payment</div>}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ViewActiveBookings;
