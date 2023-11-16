import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useBookingStore,
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";

const CancelButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const { cancelScheduledNewsletter } = useNewsletterStore();

  const handleDialogOpen = (event) => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = async (newsletterId) => {
    try {
      const message = await cancelScheduledNewsletter(newsletterId);
      openSnackbar(message);
      handleDialogClose();
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const dateTimeOptions = {
    weekday: "long", // Display the full weekday name
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const scheduledTime = new Date(newsletterData.scheduledTime).toLocaleString(
    undefined,
    dateTimeOptions,
  );

  const newsletterTypeFormatted =
    newsletterData.newsletterType === "CUSTOM"
      ? "Custom Newsletter"
      : "Personalised Recommendations";

  const confirmationDisplayDetails = [
    { label: "Email Subject", value: newsletterData.subject },
    { label: "Scheduled Time", value: scheduledTime },
    { label: "Newsletter Type", value: newsletterTypeFormatted },
  ];

  return (
    <div>
      <Button color="error" onClick={handleDialogOpen}>
        <UnsubscribeIcon />
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Cancel Scheduled Newsletter</DialogTitle>
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
            Are you sure you want to cancel this scheduled newsletter?
          </DialogContentText>
        </DialogContent>
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

export default CancelButton;
