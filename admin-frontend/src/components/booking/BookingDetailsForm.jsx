import { Grid, TextField, Typography, useTheme } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const BookingDetailsForm = ({ appointmentData }) => {
  const theme = useTheme();
  const vendorDisplayDetails = [
    { label: "Name", value: appointmentData?.vendorName },
    { label: "Contact Number", value: appointmentData?.vendorId.companyPhoneNumber?.toString() },
    {
      label: "Contact Email",
      value: appointmentData?.vendorId.companyEmail,
    },
    // {
    //   label: "Timeslot",
    //   value: `${new Date(
    //     appointmentData?.startDate,
    //   ).toLocaleTimeString()} - ${new Date(
    //     appointmentData?.endDate,
    //   ).toLocaleTimeString()}`,
    // },
    // { label: "Total Cost", value: `$${appointmentData?.totalCost}` },
  ]

  return (
    <Grid
      container
      alignItems="left"
      justifyContent="left"
      style={{
        display: "flex",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 2,
        paddingBottom: 6,
      }}
    >
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <Typography fontWeight={"bold"} fontSize={"1.5rem"} color="primary">
          Booking Details
        </Typography>
      </Grid>
      {vendorDisplayDetails.map((detail, index) => (
            <div key={index}>
              <Grid item xs={2} sx={{ paddingBottom: 2, paddingRight: 2 }}>
        <Typography fontWeight="bold" color="primary" align="right">
                  {detail.label}
              </Typography>
      </Grid>
      <Grid item xs={2} sx={{ paddingBottom: 2 }}>
        <Typography>
                {detail.value}
              </Typography>
      </Grid>
            </div>
          ))}
      <Grid item xs={2} sx={{ paddingBottom: 2, paddingRight: 2 }}>
        <Typography fontWeight="bold" color="primary" align="right">
                  Vendor: {" "}
              </Typography>
      </Grid>
      <Grid item xs={10} sx={{ paddingBottom: 2 }}>
        <Typography>
                {appointmentData?.vendorName}
              </Typography>
      </Grid>
      <Grid item xs={2} sx={{ paddingBottom: 2, paddingRight: 2 }}>
        <Typography fontWeight="bold" color="primary" align="right">
                  Client:{" "}
              </Typography>
      </Grid>
      <Grid item xs={10} sx={{ paddingBottom: 2 }}>
        <Typography>
                {appointmentData?.clientId.name}
              </Typography>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <TextField
          value={appointmentData?.clientId.name}
          fullWidth
          label="Client"
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <TextField
          value={appointmentData?.title}
          fullWidth
          label="Activity"
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label="Date"
            value={dayjs(appointmentData?.startDate)}
            format="LL"
            readOnly
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", alignItems: "center", paddingBottom: 2 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            defaultValue={dayjs(appointmentData?.startDate)}
            readOnly
          />
          <div style={{ paddingLeft: 10, paddingRight: 10 }}>-</div>
          <TimePicker
            label="End Time"
            defaultValue={dayjs(appointmentData?.endDate)}
            readOnly
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <Typography fontWeight={"bold"} fontSize={"1.5rem"} color={theme.palette.primary.main}>
          More Information
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <TextField
          value={appointmentData?.additionalComments}
          fullWidth
          label="Additional Comments"
          multiline
          rows={4}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={6} sx={{ paddingBottom: 2, paddingRight: 2 }}>
        <TextField
          value={appointmentData?.totalPax}
          label="Number of participants"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sx={{ paddingBottom: 2 }}>
        <TextField
          value={appointmentData?.eventLocationType}
          label="Location"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

BookingDetailsForm.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDateTime: PropTypes.instanceOf(Date).isRequired,
  endDateTime: PropTypes.instanceOf(Date).isRequired,
  clientId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  additionalComments: PropTypes.string,
  totalPax: PropTypes.number,
  eventLocationType: PropTypes.string,
};

// const appointmentDataShape = PropTypes.shape({
//   _id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   startDateTime: PropTypes.instanceOf(Date).isRequired,
//   endDateTime: PropTypes.instanceOf(Date).isRequired,
//   clientId: PropTypes.string.isRequired,
//   status: PropTypes.string.isRequired,
//   additionalComments: PropTypes.string,
//   totalPax: PropTypes.number,
//   eventLocationType: PropTypes.string,
// }).isRequired;

export default BookingDetailsForm;
