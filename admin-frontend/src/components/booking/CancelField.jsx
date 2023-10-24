import React, { useState } from "react";
import { useTheme } from "@emotion/react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const CancelField = ({ params, cancelBooking, openSnackbar }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleDialogOpen = () => {
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
    { label: "Client Company", value: params.row.clientId.companyName },
    { label: "Vendor", value: params.row.vendorName},
    { label: "Activity", value: params.row.activityTitle },
    {
      label: "Date",
      value: new Date(params.row.startDateTime).toLocaleDateString(),
    },
    {
      label: "Timeslot",
      value: `${new Date(
        params.row.startDateTime,
      ).toLocaleTimeString()} - ${new Date(
        params.row.endDateTime,
      ).toLocaleTimeString()}`,
    },
    { label: "Total Cost", value: `$${params.row.totalCost}` },
  ];


  return (
    <div>
      <Button variant="contained" color="error" onClick={handleDialogOpen}>
        Cancel
      </Button>

      <Dialog fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
        {confirmationDisplayDetails.map((detail, index) => (
            <div key={index}>
              <Typography>
                <span
                  style={{
                    fontWeight: "bold",
                    color: theme.palette.dark_purple.main,
                  }}
                >
                  {detail.label}:{" "}
                </span>
                {detail.value}
              </Typography>
            </div>
          ))}
          <DialogContentText sx={{ pt: 2 }}>Please provide a reason for cancelling this booking:</DialogContentText>
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
            onClick={async () => await handleConfirmCancel(params.row.id)}
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
