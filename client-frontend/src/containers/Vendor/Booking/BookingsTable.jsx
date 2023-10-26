import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Chip, Drawer, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import BookingDetailsForm from "./BookingDetailsForm.jsx";

const BookingsTable = ({ allBookings, status, additionalColumns }) => {
  const [bookings, setBookings] = useState([]);
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const formattedBookings = allBookings.filter((booking) =>
        status.includes(booking.status)
      );
      setBookings(formattedBookings);
      setIsLoading(false);
    }, 1000);
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

  const handleRowClick = ({
    _id,
    activityTitle,
    endDateTime,
    startDateTime,
    ...restProps
  }) => {
    const newBooking = {
      id: _id,
      title: activityTitle,
      startDate: startDateTime,
      endDate: endDateTime,
      ...restProps,
    };

    setSelectedBooking(newBooking);
    setIsDrawerOpen(true);
  };

  const handleCloseBookingDetails = () => {
    setSelectedBooking();
    setIsDrawerOpen(false);
  };

  const commonColumns = [
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
            Booked
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
              Booked on&nbsp;
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
  ];
  const columns = [...commonColumns, ...additionalColumns];

  return (
    <div style={{ height: 500, width: "99%" }}>
      <DataGrid
        loading={isLoading}
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
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleCloseBookingDetails}
      >
        <Box sx={{ width: "650px", paddingTop: "30px" }}>
          <BookingDetailsForm appointmentData={selectedBooking} />
        </Box>
      </Drawer>
    </div>
  );
};

BookingsTable.propTypes = {
  allBookings: PropTypes.array.isRequired,
  status: PropTypes.array.isRequired,
  additionalColumns: PropTypes.array.isRequired,
};

export default BookingsTable;
