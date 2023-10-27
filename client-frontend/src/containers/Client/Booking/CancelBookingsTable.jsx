import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import notFound from "../../../assets/not_found.png";
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Button,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CancelField from "../../../components/CancelField";

const CancelBookingsTable = ({
  allBookings,
  filter,
  approveBooking,
  rejectBooking,
  openSnackbar,
}) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();

  let containerStyle = {
    minHeight: "10rem", // Default for extra-large screens
    width: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
    borderBottomLeftRadius: "4px",
  };
  useEffect(() => {
    const formattedBookings = filter(allBookings);
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

  const handleRowClick = ({ _id }) => {
    navigate(`/booking/${_id.toString()}`);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBooking();
    setIsDrawerOpen(false);
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
      renderCell: (params) => {
        const title = params.value;
        const preSignedImages = params.row.activityId.preSignedImages;
        return (
          <Box display="flex" flexDirection="column">
            <Typography
              fontSize={"0.875rem"}
              color={secondary}
              fontWeight={700}
              textAlign="center"
            >
              {title}
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              width={"100%"}
              bgcolor={"grey.50"}
            >
              {/* Apply styling to the image */}
              {preSignedImages && preSignedImages.length > 0 && (
                <img
                  src={preSignedImages[0]}
                  alt={title}
                  style={containerStyle}
                />
              )}
              {!preSignedImages.length > 0 && (
                <img src={notFound} alt={title} style={containerStyle} />
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "vendorName",
      flex: 1,
      renderCell: (params) => {
        const vendorName = params.row.vendorName;
        return <div style={{ display: "flex" }}>{vendorName}</div>;
      },
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Vendor
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
            Booked On
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
              <span style={{ color: "rgb(0 0 0 /0.87)" }}>
                {convertISOtoShortDate(date)} at {convertISOtoTime(date)}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "totalPax",
      flex: 0.5,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Pax
          </Typography>
        );
      },
      renderCell: (params) => {
        const totalCost = params.value;
        return (
          <div style={{ display: "flex" }}>
            <Typography fontSize={"0.875rem"}>{totalCost}</Typography>
          </div>
        );
      },
    },
    {
      field: "totalCost",
      flex: 0.5,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Total Cost
          </Typography>
        );
      },
      renderCell: (params) => {
        const totalCost = params.value;
        return (
          <div style={{ display: "flex" }}>
            <Typography
              fontWeight={700}
              color={secondary}
              fontSize={"0.875rem"}
            >
              $ {totalCost.toFixed(2)}
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
      field: "actions",
      type: "actions",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Actions
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
            <CancelField bookingData={params.row} />
            {/* <BookingRejectModal
              open={rejectModalOpen}
              onClose={handleCloseRejectModal}
              bookingToReject={bookingToReject}
              handleRejectReasonChange={handleRejectReasonChange}
              handleRejectButton={handleRejectButton}
              rejectionReason={rejectionReason}
            /> */}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: "80vh", width: "99%" }}>
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
        onRowClick={(params) => handleRowClick(params.row)}
      />
      {/* <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleCloseBookingDetails}
      >
        <Box sx={{ width: "650px" }}>
          <BookingDetailsForm appointmentData={selectedBooking} />
        </Box>
      </Drawer> */}
    </div>
  );
};

CancelBookingsTable.propTypes = {
  allBookings: PropTypes.array.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};

export default CancelBookingsTable;
