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
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { getTotalHeaderHeight } from "@mui/x-data-grid/internals";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const PREFIX = "Demo";

const classes = {
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  flexContainer: `${PREFIX}-flexContainer`,
};

const MyBookingsCalendarView = ({ allBookings }) => {
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
      .map((booking) => ({
        id: booking._id,
        title: booking.activityTitle,
        startDate: booking.startDateTime,
        endDate: booking.endDateTime,
        status: booking.status,
        pax: booking.totalPax,
        additionalComments: booking.additionalComments,
        creationDate: booking.creationDate,
      }))
      .filter((booking) =>
        filterCriteria[newStatus].value === "ALL"
          ? booking.status === filterCriteria.pending.value ||
            booking.status === filterCriteria.confirmed.value
          : booking.status === filterCriteria[newStatus].value
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
          <Typography variant="h6" color={theme.palette.primary.main}>
            {appointmentData.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Booked on: {convertISOtoDate(appointmentData.creationDate)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Date of Activity: {convertISOtoDate(appointmentData.startDate)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Pax: {appointmentData.pax}</Typography>
        </Grid>
        {appointmentData.additionalComments && (
          <Grid item xs={12}>
            <Typography>
              Additional Comments: {appointmentData.additionalComments}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon fontSize="small" />
            <Typography sx={{ paddingLeft: 1 }}>
              {convertISOtoTime(appointmentData.startDate)} -&nbsp;
              {convertISOtoTime(appointmentData.endDate)}
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  };
  const ToolTipHeader = ({ children, appointmentData, ...restProps }) => {
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
          <Grid item xs={8}>
            <Typography variant="h5" color={theme.palette.primary.dark}>
              {appointmentData.status === "PENDING_CONFIRMATION"
                ? "Pending Confirmation"
                : "Confirmed Booking"}
            </Typography>
          </Grid>
        </Grid>
      </AppointmentTooltip.Header>
    );
  };

  const setBookingFormat = (bookings) => {
    return bookings
      .map((booking) => ({
        id: booking._id,
        title: booking.activityTitle,
        startDate: booking.startDateTime,
        endDate: booking.endDateTime,
        status: booking.status,
        pax: booking.totalPax,
        additionalComments: booking.additionalComments,
        creationDate: booking.creationDateTime,
      }))
      .filter((booking) =>
        filterCriteria[currentStatus].value === "ALL"
          ? booking.status === filterCriteria.pending.value ||
            booking.status === filterCriteria.confirmed.value
          : booking.status === filterCriteria[currentStatus].value
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
            sx={{ fontWeight: "bold", marginLeft: "5px" }}
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

  useEffect(() => {
    const formattedBookings = setBookingFormat(allBookings);
    setBookings(formattedBookings);
  }, [allBookings]);

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
          showCloseButton
        />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

MyBookingsCalendarView.propTypes = {
  allBookings: PropTypes.array.isRequired,
};

export default MyBookingsCalendarView;
