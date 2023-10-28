import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { IconButton, alpha } from "@mui/material";
import { useState } from "react";
import BookingRejectModal from "./BookingRejectModal";
import useBookingStore from "../../../zustand/BookingStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

const ConfirmField = ({ bookingData }) => {
  console.log(bookingData);
  const theme = useTheme();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState("");
  const { approveBooking, rejectBooking } = useBookingStore();
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

  const handleOpenRejectModal = (booking) => {
    setRejectModalOpen(true);
    setBookingToReject(booking);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };

  const handleRejectReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

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
        onClick={async () => await handleApproveButton(bookingData._id)}
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
        onClick={() => handleOpenRejectModal(bookingData)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <BookingRejectModal
        open={rejectModalOpen}
        onClose={handleCloseRejectModal}
        bookingToReject={bookingToReject}
        handleRejectReasonChange={handleRejectReasonChange}
        handleRejectButton={handleRejectButton}
        rejectionReason={rejectionReason}
      />
    </div>
  );
};

export default ConfirmField;
