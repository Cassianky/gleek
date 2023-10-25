import { EditingState, ViewState } from "@devexpress/dx-react-scheduler";
import {
  AppointmentForm,
  AppointmentTooltip,
  Appointments,
  DateNavigator,
  EditRecurrenceMenu,
  MonthView,
  Scheduler,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import DoneIcon from "@mui/icons-material/Done";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { alpha, styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  ToolTipHeaderPropTypes,
  appointmentDataShape,
} from "../../../utils/ComponentPropTypes";
import BookingDetailsForm from "./BookingDetailsForm";
import BookingRejectModal from "./BookingRejectModal";

const PREFIX = "Demo";

const classes = {
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
};

const BookingsMonthView = ({
  allBookings,
  approveBooking,
  rejectBooking,
  openSnackbar,
}) => {
  const theme = useTheme();
  const filterCriteria = {
    all: { value: "ALL", text: "All" },
    pending: {
      value: "PENDING_CONFIRMATION",
      text: "Pending",
    },
    confirmed: { value: "CONFIRMED", text: "Confirmed" },
  };
  const filterColors = {
    PENDING_CONFIRMATION: theme.palette.success.pastel,
    CONFIRMED: theme.palette.primary.main,
    ALL: theme.palette.grey.A700,
  };

  const [bookings, setBookings] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState();

  const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
      flex: "none",
    },
    [`& .${classes.flexContainer}`]: {
      display: "flex",
      alignItems: "center",
    },
  }));

  const onSelectorChange = (event) => {
    setCurrentStatus(event.target.value);
    const newStatus = event.target.value;
    const newBookings = allBookings
      .map(
        ({ _id, activityTitle, endDateTime, startDateTime, ...restProps }) => ({
          id: _id,
          title: activityTitle,
          startDate: startDateTime,
          endDate: endDateTime,
          ...restProps,
        }),
      )
      .filter((booking) =>
        filterCriteria[newStatus].value === "ALL"
          ? booking.status === filterCriteria.pending.value ||
            booking.status === filterCriteria.confirmed.value
          : booking.status === filterCriteria[newStatus].value,
      );
    setBookings(newBookings);
  };

  const BookingStatusSelector = ({ currentStatus, onSelectorChange }) => {
    return (
      <FormControl variant="standard">
        <Select value={currentStatus} onChange={onSelectorChange}>
          {Object.keys(filterCriteria).map((key, index) => (
            <MenuItem value={key} key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    backgroundColor: filterColors[filterCriteria[key].value],
                    borderRadius: "50%",
                    width: 10,
                    height: 10,
                    marginRight: 4,
                  }}
                />
                <Typography>{filterCriteria[key].text}</Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const handleOpenRejectModal = (booking) => {
    setRejectModalOpen(true);
    setBookingToReject(booking);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };

  const handleRejectReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const FlexibleSpace = ({ ...restProps }) => (
    <StyledToolbarFlexibleSpace
      {...restProps}
      className={classes.flexibleSpace}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <BookingStatusSelector
          currentStatus={currentStatus}
          onSelectorChange={onSelectorChange}
        />
        <CollectionsBookmarkIcon
          sx={{ color: theme.palette.primary.main, marginLeft: 2 }}
        />
        <Typography
          color={theme.palette.primary.main}
          style={{ marginLeft: "10px", marginRight: "10px" }}
          fontSize={25}
        >
          My Bookings
        </Typography>
      </div>
    </StyledToolbarFlexibleSpace>
  );

  const convertISOtoDate = (value) => {
    const date = new Date(value);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-SG", options);
    return formattedDate;
  };

  const convertISOtoTime = (value) => {
    const date = new Date(value);
    const formattedTime = date
      .toLocaleTimeString("en-SG", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toUpperCase();
    return formattedTime;
  };

  const ToolTipContent = ({ appointmentData }) => {
    return (
      <Grid
        container
        alignItems="left"
        justifyContent="left"
        style={{
          display: "flex",
          paddingLeft: 12,
          paddingTop: 2,
          paddingBottom: 6,
        }}
      >
        <Grid item xs={12}>
          <Typography fontSize={"1.25rem"} color={theme.palette.primary.main}>
            {appointmentData.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>{convertISOtoDate(appointmentData.startDate)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon fontSize="small" />
            <Typography sx={{ paddingLeft: 1 }}>
              {convertISOtoTime(appointmentData.startDate)} -&nbsp;
              {convertISOtoTime(appointmentData.endDate)}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sx={{ paddingBottom: 2 }}>
          <Typography>
            Booked by&nbsp;
            <span style={{ color: theme.palette.primary.main }}>
              {appointmentData.clientId?.name}
            </span>
          </Typography>
        </Grid>
      </Grid>
    );
  };
  const ToolTipHeader = ({
    children,
    appointmentData,
    onOpenButtonClick,
    onHide,
    ...restProps
  }) => {
    const handleChildClick = () => {
      onHide();
    };
    return (
      <AppointmentTooltip.Header {...restProps}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{
            display: "flex",
            paddingTop: 8,
            paddingLeft: 4,
            paddingBottom: 4,
          }}
        >
          <Grid item xs={appointmentData.status === "CONFIRMED" ? 10 : 6}>
            <Button
              onClick={() => {
                onOpenButtonClick();
                onHide();
              }}
              sx={{
                paddingTop: 0,
                paddingBottom: 0,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                fontSize={"1.5rem"}
                color={theme.palette.primary.dark}
                sx={{ textDecoration: "underline" }}
              >
                {appointmentData.status === "PENDING_CONFIRMATION"
                  ? "New Booking!"
                  : "Confirmed Booking"}
              </Typography>
            </Button>
          </Grid>
          {appointmentData.status === "PENDING_CONFIRMATION" && (
            <Grid item xs={4}>
              <IconButton
                sx={{
                  backgroundColor: theme.palette.success.pastel,
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.success.pastel, 0.5),
                  },
                  marginRight: 1,
                }}
                onClick={async () =>
                  await handleApproveButton(appointmentData.id)
                }
              >
                <DoneIcon />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.5),
                  },
                }}
                onClick={async () => {
                  handleChildClick();
                  handleOpenRejectModal(appointmentData);
                }}
              >
                <CloseIcon />
              </IconButton>
              {children}
            </Grid>
          )}
          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <IconButton
              onClick={() => {
                handleChildClick();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppointmentTooltip.Header>
    );
  };

  const setBookingFormat = (bookings) => {
    return bookings
      .map(
        ({ _id, activityTitle, endDateTime, startDateTime, ...restProps }) => ({
          id: _id,
          title: activityTitle,
          startDate: startDateTime,
          endDate: endDateTime,
          ...restProps,
        }),
      )
      .filter((booking) =>
        filterCriteria[currentStatus].value === "ALL"
          ? booking.status === filterCriteria.pending.value ||
            booking.status === filterCriteria.confirmed.value
          : booking.status === filterCriteria[currentStatus].value,
      );
  };

  const Appointment = ({ style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: filterColors[restProps.data.status],
        borderRadius: 10,
      }}
    >
      <Grid
        container
        alignItems="left"
        justifyContent="left"
        style={{
          display: "flex",
          paddingLeft: 10,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <Grid item xs={12} style={{ display: "flex" }}>
          {restProps.data.status === "PENDING_CONFIRMATION" && (
            <NewReleasesIcon sx={{ color: "white" }} />
          )}
          <Typography
            fontSize={"1rem"}
            color="white"
            sx={{ fontWeight: "bold" }}
          >
            {restProps.data.title}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ display: "flex" }}>
          <Typography
            fontSize={"0.75rem"}
            sx={{ paddingLeft: 1 }}
            color="white"
          >
            {convertISOtoTime(restProps.data.startDate)} -&nbsp;
            {convertISOtoTime(restProps.data.endDate)}
          </Typography>
        </Grid>
      </Grid>
    </Appointments.Appointment>
  );

  const handleApproveButton = async (bookingId) => {
    try {
      const message = await approveBooking(bookingId);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error, "error");
    }
  };

  const handleRejectButton = async (bookingId) => {
    try {
      const message = await rejectBooking(bookingId);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error, "error");
    }
  };

  useEffect(() => {
    const formattedBookings = setBookingFormat(allBookings);
    setBookings(formattedBookings);
  }, [allBookings]);

  ToolTipHeader.propTypes = ToolTipHeaderPropTypes;
  ToolTipContent.propTypes = {
    appointmentData: appointmentDataShape,
  };

  return (
    <Paper
      sx={{
        borderRadius: "10px",
        boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
      }}
    >
      <Scheduler locale="en-SG" data={bookings}>
        <EditingState />
        <ViewState defaultCurrentDate={Date().toLocaleString()} />

        <MonthView />
        <WeekView startDayHour={7} endDayHour={23} />
        <Appointments appointmentComponent={Appointment} />
        <Toolbar flexibleSpaceComponent={FlexibleSpace} />
        <ViewSwitcher />
        <DateNavigator />
        <EditRecurrenceMenu />
        <AppointmentTooltip
          headerComponent={ToolTipHeader}
          contentComponent={ToolTipContent}
        />
        <AppointmentForm readOnly basicLayoutComponent={BookingDetailsForm} />
      </Scheduler>
      <BookingRejectModal
        open={rejectModalOpen}
        onClose={handleCloseRejectModal}
        bookingToReject={bookingToReject}
        handleRejectReasonChange={handleRejectReasonChange}
        handleRejectButton={handleRejectButton}
        rejectionReason={rejectionReason}
      />
    </Paper>
  );
};

BookingsMonthView.propTypes = {
  allBookings: PropTypes.array.isRequired,
  approveBooking: PropTypes.func.isRequired,
  rejectBooking: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};

export default BookingsMonthView;
