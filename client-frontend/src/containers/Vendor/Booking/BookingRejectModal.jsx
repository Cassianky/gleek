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
import PropTypes from "prop-types";

const BookingRejectModal = ({
  open,
  onClose,
  bookingToReject,
  handleRejectReasonChange,
  handleRejectButton,
  rejectionReason,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={async () => handleRejectButton(bookingToReject._id)}
          variant="contained"
          color="error"
          disabled={!rejectionReason || rejectionReason === ""}
        >
          REJECT
        </Button>
      </DialogActions>
    </Dialog>
  );
};
BookingRejectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingToReject: PropTypes.object,
  handleRejectReasonChange: PropTypes.func.isRequired,
  handleRejectButton: PropTypes.func.isRequired,
  rejectionReason: PropTypes.string,
};

export default BookingRejectModal;
