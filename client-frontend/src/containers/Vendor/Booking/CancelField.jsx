import { useTheme } from "@emotion/react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  convertISOtoDate,
  convertISOtoTime,
} from "../../../utils/TimeFormatter";
import useBookingStore from "../../../zustand/BookingStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

const CancelField = ({ bookingData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { openSnackbar } = useSnackbarStore();
  const { cancelBooking } = useBookingStore();

  const handleDialogOpen = (event) => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmCancel = async (bookingId) => {
    try {
      const message = await cancelBooking(bookingId, reason);
      openSnackbar(message);
      setDialogOpen(false);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const confirmationDisplayDetails = [
    { label: "Client Company", value: bookingData.clientId.companyName },
    { label: "Activity", value: bookingData.activityTitle },
    {
      label: "Date",
      value: convertISOtoDate(bookingData.startDateTime),
    },
    {
      label: "Timeslot",
      value: `${convertISOtoTime(
        bookingData.startDateTime
      )} - ${convertISOtoTime(bookingData.endDateTime)}`,
    },
    { label: "Total Cost", value: `$${bookingData.totalCost}` },
  ];

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleDialogOpen}>
        Cancel
      </Button>

      <Dialog
        fullWidth
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          "& .MuiDialog-paper": {
            border: "3px solid #D32F2F",
            borderRadius: "10px",
            boxShadow: "none",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgb(0 0 0 / 0.2)",
          },
        }}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          {confirmationDisplayDetails.map((detail, index) => (
            <div key={index}>
              <Typography>
                <span
                  style={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {detail.label}:{" "}
                </span>
                {detail.value}
              </Typography>
            </div>
          ))}
          <DialogContentText sx={{ pt: 2 }}>
            Please provide a reason for cancelling this booking:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason"
            fullWidth
            variant="standard"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Back
          </Button>
          <Button
            onClick={async () => await handleConfirmCancel(bookingData._id)}
            color="primary"
            disabled={!reason.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CancelField;
