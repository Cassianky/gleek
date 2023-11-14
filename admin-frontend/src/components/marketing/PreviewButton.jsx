import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import PreviewIcon from "@mui/icons-material/Preview";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const PreviewButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const { updateBookingToPaid } = useBookingStore();

  const handleDialogOpen = (event) => {
    event.stopPropagation();
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

  return (
    <div>
      <Button
        color="primary"
        //   variant="contained"
        onClick={handleDialogOpen}
      >
        <PreviewIcon />
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Payment</DialogTitle>
        {/* <DialogContent>
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
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => await handleConfirm(newsletterData.id)}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviewButton;
