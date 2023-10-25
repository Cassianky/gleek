import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  alpha,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmField = ({ bookingData }) => {
  const theme = useTheme();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState("");
  const { isLoading, approveBooking, rejectBooking } = useBookingStore();
  const { openSnackbar } = useSnackbarStore();

  const handleApproveButton = async (bookingId) => {
    try {
      const message = await approveBooking(bookingId);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const handleRejectButton = async (bookingId) => {
    try {
      const message = await rejectBooking(bookingId, rejectionReason);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const handleOpenRejectModal = (event, activity) => {
    event.stopPropagation();
    setRejectModalOpen(true);
    setBookingToReject(activity);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };

  const handleRejectReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const confirmationDisplayDetails = [
    { label: "Client Company", value: bookingData.clientId.companyName },
    { label: "Vendor", value: bookingData.vendorName },
    { label: "Activity", value: bookingData.activityTitle },
    {
      label: "Date",
      value: new Date(bookingData.startDateTime).toLocaleDateString(),
    },
    {
      label: "Timeslot",
      value: `${new Date(
        bookingData.startDateTime,
      ).toLocaleTimeString()} - ${new Date(
        bookingData.endDateTime,
      ).toLocaleTimeString()}`,
    },
    { label: "Total Cost", value: `$${bookingData.totalCost}` },
  ];

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  } else {
    // console.log(bookingData.activityId);
    if (bookingData.activityId.adminCreated) {
      return (
        <div
          style={{
            display: "flex",
            paddingTop: 3,
            paddingBottom: 3,
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              backgroundColor: theme.palette.success.pastel,
              color: "white",
              "&:hover": {
                backgroundColor: alpha(theme.palette.success.pastel, 0.5),
              },
              marginRight: 1,
              height: "38px",
              width: "38px",
            }}
            onClick={async () => await handleApproveButton(bookingData.id)}
          >
            <DoneIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: theme.palette.error.main,
              color: "white",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.5),
              },
              height: "38px",
              width: "38px",
            }}
            onClick={(e) => handleOpenRejectModal(e, bookingData)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Dialog
            fullWidth
            open={rejectModalOpen}
            onClose={handleCloseRejectModal}
          >
            <DialogTitle>
              <Typography fontSize={"1.25rem"}>
                Confirm Rejection of Booking
              </Typography>
            </DialogTitle>
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
                Please provide a reason for rejecting this booking request:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="reject"
                label="Reject Reason"
                fullWidth
                variant="standard"
                onChange={handleRejectReasonChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCloseRejectModal()}>Cancel</Button>
              <Button
                onClick={async () => await handleRejectButton(bookingData.id)}
                variant="contained"
                color="error"
                disabled={!rejectionReason || rejectionReason === ""}
              >
                REJECT
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
      return null;
    }
  }
};

export default ConfirmField;
