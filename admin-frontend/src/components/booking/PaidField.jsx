import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PaidField = ({ params, openSnackbar, updateBookingToPaid }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = async (bookingId) => {
    try {
      const message = await updateBookingToPaid(bookingId);
      openSnackbar(message);
      handleDialogClose();
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const confirmationDisplayDetails = [
    { label: "Client Company", value: params.row.clientId.companyName },
    { label: "Vendor", value: params.row.vendorName },
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
      <Button variant="contained" color="success" onClick={handleDialogOpen}>
        Paid
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Payment</DialogTitle>
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

          <DialogContentText sx={{ pt: 2 }}>
            Are you sure you want to mark this booking as paid?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => await handleConfirm(params.row.id)}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaidField;
