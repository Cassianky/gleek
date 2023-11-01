import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PaidIcon from "@mui/icons-material/Paid";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertISOtoDate, convertISOtoTime } from "../../../utils/TimeFormatter";

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
      field: "vendor",
      flex: 1,
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
      renderCell: (params) => {
        return params.row.activityId.linkedVendor.companyName;
      },
      valueGetter: (params) => {
        return params.row.activityId.linkedVendor.companyName;
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
      valueGetter: (params) => {
        return params.row.startDateTime;
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
      valueGetter: (params) => {
        return params.row.startDateTime;
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
        checkboxSelection={false}
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
