import React, { useState } from "react";
import { useTheme } from "@emotion/react";
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

const ConfirmField = ({
  params,
  approveBooking,
  rejectBooking,
  openSnackbar,
  isLoading,
}) => {
  const theme = useTheme();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState("");

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
      const message = await rejectBooking(bookingId, rejectionReason);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error, "error");
    }
  };

  const handleOpenRejectModal = (activity) => {
    setRejectModalOpen(true);
    setBookingToReject(activity);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };

  const handleRejectReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  } else {
    console.log(params.row.activityId);
    if (params.row.activityId.adminCreated) {
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
            onClick={async () => await handleApproveButton(params.row.id)}
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
            onClick={() => handleOpenRejectModal(params.row)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Dialog
            open={rejectModalOpen}
            onClose={handleCloseRejectModal}
            sx={{
              "& .MuiDialog-paper": {
                border: "3px solid #D32F2F",
                borderRadius: "10px",
                boxShadow: "none",
              },
            }}
          >
            <DialogTitle sx={{ paddingBottom: 0 }}>
              <div style={{ display: "flex" }}>
                <Typography fontSize={"1.25rem"}>
                  Rejecting booking for&nbsp;
                </Typography>
                <Typography color="#9F91CC" fontSize={"1.25rem"}>
                  {bookingToReject?.activityTitle}
                </Typography>
              </div>
            </DialogTitle>
            <DialogTitle sx={{ paddingTop: 0 }}>
              <div style={{ display: "flex" }}>
                <Typography fontSize={"1rem"}>Booking made by&nbsp;</Typography>
                <Typography color="#9F91CC" fontSize={"1rem"}>
                  {bookingToReject?.clientId?.name}
                </Typography>
              </div>
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Provide a reason for rejecting booking request!
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
                onClick={async () => await handleRejectButton(params.row.id)}
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
