import { Grid, TextField, Typography, useTheme } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";
import { appointmentDataShape } from "../../../utils/ComponentPropTypes";

const BookingDetailsForm = ({ appointmentData }) => {
  const theme = useTheme();
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
        <Typography fontSize={"1.5rem"} color={theme.palette.primary.main}>
          Booking Details
        </Typography>
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
        <Typography fontSize={"1.5rem"} color={theme.palette.primary.main}>
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
  appointmentData: appointmentDataShape,
};

export default BookingDetailsForm;
