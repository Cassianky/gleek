import { useEffect, useState } from "react";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Chip, Typography, Drawer, Box } from "@mui/material";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookingDetailsForm from "./BookingDetailsForm.jsx";


const BookingsTable = ({ bookings, status, additionalColumns }) => {
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();

  useEffect(() => {
    setFilteredBookings(
      bookings.filter((booking) => booking.status === status),
    );
  }, [bookings]);

  const standardColumns = [
    { field: "activityTitle", headerName: "Activity Title", flex: 1 },
    {
      field: "clientId",
      headerName: "Client Company",
      flex: 1,
      valueGetter: (params) => {
        return params.value.companyName;
      },
    },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    {
      field: "startDateTime",
      headerName: "Event Date",
      type: "date",
      flex: 1,
      valueGetter: (params) => {
        return new Date(params.value);
      },
    },
    {
      field: "timeslot",
      headerName: "Timeslot",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        const startTime = new Date(
          params.row.startDateTime,
        ).toLocaleTimeString();
        const endTime = new Date(params.row.endDateTime).toLocaleTimeString();
        return (
          <div style={{ display: "flex", width: "100%" }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={
                <Typography fontSize={"0.875rem"}>
                  {startTime} - {endTime}
                </Typography>
              }
            />
          </div>
        );
      },
    },
    { field: "eventLocationType", headerName: "Event Location Type", flex: 1 },
    { field: "totalPax", headerName: "Total Pax", type: "number", flex: 1 },
    {
      field: "totalCost",
      headerName: "Total Cost (SGD)",
      type: "number",
      flex: 1,
      valueGetter: (params) => `$${params.value}`,
    },
  ];

  const columns = [...standardColumns, ...additionalColumns];

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

  return (
    <div style={{ height: "100%", width: "99%" }}>
      <DataGrid
        rows={filteredBookings}
        columns={columns}
        autoHeight
        getRowHeight={() => "auto"}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        slots={{ toolbar: GridToolbarFilterButton }}
        onRowClick={(params) => handleRowClick(params.row)}
      />
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleCloseBookingDetails}
      >
        <Box sx={{ width: "650px", paddingTop: "75px" }}>
          <BookingDetailsForm appointmentData={selectedBooking} />
        </Box>
      </Drawer>
    </div>
  );
};

BookingsTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  additionalColumns: PropTypes.array.isRequired,
};

export default BookingsTable;
