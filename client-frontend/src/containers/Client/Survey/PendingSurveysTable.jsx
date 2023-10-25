import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PaidIcon from "@mui/icons-material/Paid";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const PendingSurveysTable = ({
  allBookings,

  openSnackbar,
}) => {
  const [bookings, setBookings] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setBookings(allBookings);
    console.log(bookings);
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

  const statusIcons = {
    CONFIRMED: { icon: <ThumbUpAltIcon color="primary" />, text: "Confirmed" },
    REJECTED: { icon: <CancelIcon color="primary" />, text: "Rejected" },
    CANCELLED: { icon: <EventBusyIcon color="primary" />, text: "Cancelled" },
    PENDING_PAYMENT: {
      icon: <PaidIcon color="primary" />,
      text: "Pending Payment",
    },
    PAID: { icon: <EventAvailableIcon color="primary" />, text: "Paid" },
  };

  const handleGoToSurvey = (booking) => {
    navigate(`/booking/${booking._id}/survey/edit`);
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
            Booked Activity
          </Typography>
        );
      },
    },
    {
      field: "status",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Status
          </Typography>
        );
      },
      renderCell: (params) => {
        const rowStatus = params.row.status;
        return (
          <Stack alignItems={"center"} direction="row">
            {statusIcons[rowStatus].icon} {statusIcons[rowStatus].text}
          </Stack>
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
      field: "go",
      type: "actions",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Go to Survey
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
              onClick={() => handleGoToSurvey(params.row)}
            >
              <EditNoteIcon fontSize="small" />
            </IconButton>
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

PendingSurveysTable.propTypes = {
  allBookings: PropTypes.array.isRequired,
};

export default PendingSurveysTable;
