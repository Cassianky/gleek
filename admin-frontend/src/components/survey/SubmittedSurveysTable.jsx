import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ArticleIcon from '@mui/icons-material/Article';
import {
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
  Button,
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

const SubmittedSurveysTable = ({ allSurveys, openSnackbar }) => {
  const [bookings, setBookings] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setSurveys(allSurveys);
  }, [allSurveys]);

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
    navigate(`/surveys/${booking._id}`);
  };

  const columns = [
    {
      field: "activityTitle",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Activity Title
          </Typography>
        );
      },
      renderCell: (params) => {
        return params.row.activity.title;
      },
      valueGetter: (params) => {
        return params.row.activity.title;
      },
    },
    {
      field: "clientId",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Client Company
          </Typography>
        );
      },
      renderCell: (params) => {
        return params.row.booking.clientId.name;
      },
      valueGetter: (params) => {
        return params.row.booking.clientId.name;
      },
    },
    {
      field: "vendorName",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Vendor
          </Typography>
        );
      },
      renderCell: (params) => {
        return params.row.activity.linkedVendor.companyName;
      },
      valueGetter: (params) => {
        return params.row.activity.linkedVendor.companyName;
      },
    },
    {
      field: "startDateTime",
      headerName: "Event Date",
      type: "date",
      flex: 1,
      valueGetter: (params) => {
        return new Date(params.row.booking.startDateTime);
      },
    },
    {
      field: "status",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Status
          </Typography>
        );
      },
      renderCell: (params) => {
        const rowStatus = params.row.booking.status;
        return (
          <Stack alignItems={"center"} direction="row">
            {statusIcons[rowStatus].icon} {statusIcons[rowStatus].text}
          </Stack>
        );
      },
      valueGetter: (params) => {
        return params.row.booking.status;
      },
    },
    {
      field: "date",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Date Submitted
          </Typography>
        );
      },
      renderCell: (params) => {
        const date = params.row.created;
        return (
          <div style={{ display: "flex" }}>
            <Typography fontSize={"0.875rem"}>
              {convertISOtoDate(date)}
            </Typography>
          </div>
        );
      },
      valueGetter: (params) => {
        return params.row.created;
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
            sx={{ color: theme.palette.primary.main }}
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
            <Button
             color="light_purple"
              onClick={() => handleGoToSurvey(params.row)}
            >
              <ArticleIcon />
            </Button>
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
        rows={surveys}
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

SubmittedSurveysTable.propTypes = {
  allBookings: PropTypes.array.isRequired,
};

export default SubmittedSurveysTable;
