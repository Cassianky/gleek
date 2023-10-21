import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {
  Chip,
  IconButton,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import BookingRejectModal from "./BookingRejectModal.jsx";

const PendingBookingsTable = ({
  allBookings,
  approveBooking,
  rejectBooking,
  openSnackbar,
}) => {
  const [bookings, setBookings] = useState([]);
  const theme = useTheme();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState();

  useEffect(() => {
    const formattedBookings = allBookings.filter(
      (booking) => booking.status === "PENDING_CONFIRMATION"
    );
    setBookings(formattedBookings);
  }, [allBookings]);

  const convertISOtoDate = (value) => {
    const date = new Date(value);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-SG", options);
    return formattedDate;
  };
  const convertISOtoShortDate = (value) => {
    const date = new Date(value);
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-SG", options);
    return formattedDate;
  };

  const convertISOtoTime = (value) => {
    const date = new Date(value);
    const formattedTime = date
      .toLocaleTimeString("en-SG", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toUpperCase();
    return formattedTime;
  };

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

  const columns = [
    {
      field: "activityTitle",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Activity Title
          </Typography>
        );
      },
    },
    {
      field: "clientId",
      flex: 1,
      renderCell: (params) => {
        const clientName = params.value.name;
        return (
          <div style={{ display: "flex" }}>
            <Typography color="#9F91CC" fontSize={"0.875rem"}>
              Booked by&nbsp;
            </Typography>
            {clientName}
          </div>
        );
      },
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Client
          </Typography>
        );
      },
    },
    {
      field: "date",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Date
          </Typography>
        );
      },
      renderCell: (params) => {
        const date = params.row.startDateTime;
        return (
          <div style={{ display: "flex" }}>
            <Typography fontSize={"0.875rem"}>
              {convertISOtoDate(date)}
            </Typography>
          </div>
        );
      },
    },
    {
      field: "time",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Time Slot
          </Typography>
        );
      },
      renderCell: (params) => {
        const startTime = params.row.startDateTime;
        const endTime = params.row.endDateTime;
        return (
          <div style={{ display: "flex", paddingTop: 2, paddingBottom: 2 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={
                <Typography fontSize={"0.875rem"}>
                  {convertISOtoTime(startTime)} - {convertISOtoTime(endTime)}
                </Typography>
              }
              sx={{ backgroundColor: theme.palette.pale_purple.main }}
            />
          </div>
        );
      },
    },
    {
      field: "creationDateTime",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Submitted
          </Typography>
        );
      },
      renderCell: (params) => {
        const date = params.value;
        return (
          <div style={{ display: "flex" }}>
            <Typography
              fontSize={"0.875rem"}
              sx={{ color: theme.palette.primary.main }}
            >
              Submitted on&nbsp;
              <span style={{ color: "rgb(0 0 0 /0.87)" }}>
                {convertISOtoShortDate(date)} at {convertISOtoTime(date)}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "additionalComments",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Comments
          </Typography>
        );
      },
      renderCell: (params) => {
        const comments = params.value;
        return (
          <div style={{ display: "flex" }}>
            <Typography fontSize={"0.875rem"}>
              {comments === "" ? (
                <span style={{ fontStyle: "italic" }}>None</span>
              ) : (
                comments
              )}
            </Typography>
          </div>
        );
      },
    },
    {
      field: "approve",
      type: "actions",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Approve?
          </Typography>
        );
      },
      renderCell: (params) => {
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
              onClick={async () => await handleApproveButton(params.row._id)}
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
      },
    },
  ];

  return (
    <div style={{ height: 500, width: "99%" }}>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        getRowId={(row) => row._id}
        rows={bookings}
        columns={columns}
        slots={{
          toolbar: GridToolbarFilterButton,
        }}
        getRowHeight={() => "auto"}
        sx={{
          borderRadius: "10px",
          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
          border: "none",
          backgroundColor: "white",
          "& .MuiDataGrid-cell:hover": {
            cursor: "pointer",
          },
        }}
      />
    </div>
  );
};

PendingBookingsTable.propTypes = {
  allBookings: PropTypes.array.isRequired,
  approveBooking: PropTypes.func.isRequired,
  rejectBooking: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};

export default PendingBookingsTable;
