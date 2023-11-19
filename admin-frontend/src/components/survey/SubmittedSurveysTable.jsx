import ArticleIcon from "@mui/icons-material/Article";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PaidIcon from "@mui/icons-material/Paid";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Button, Stack, Typography, useTheme, Chip } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  convertISOto24,
  convertISOtoShortDate,
  convertISOtoTime,
} from "../../utils/TimeFormatter";

const SubmittedSurveysTable = ({ allSurveys, openSnackbar }) => {
  const [surveys, setSurveys] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setSurveys(allSurveys);
  }, [allSurveys]);

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
            Client
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
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Event Date
          </Typography>
        );
      },
      type: "date",
      flex: 1,
      valueGetter: (params) => {
        return new Date(params.row.booking.startDateTime);
      },
    },
    {
      field: "time",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Time Slot
          </Typography>
        );
      },
      renderCell: (params) => {
        const startTime = params.row.booking.startDateTime;
        const endTime = params.row.booking.endDateTime;
        return (
          <Chip
            label={
              <Typography fontSize={"0.7rem"}>
                {convertISOto24(startTime)} - {convertISOto24(endTime)}
              </Typography>
            }
            // sx={{ backgroundColor: theme.palette.pale_purple.main }}
          />
        );
      },
      valueGetter: (params) => {
        return params.row.startDateTime;
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
              {convertISOtoShortDate(date)}
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
