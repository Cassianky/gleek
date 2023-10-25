import { useEffect, useState } from "react";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Chip, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const BookingsTable = ({ bookings, status, additionalColumns }) => {
  const [filteredBookings, setFilteredBookings] = useState([]);

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

  return (
    <div style={{ height: "100%", width: "99%" }}>
      <DataGrid
        rows={filteredBookings}
        columns={columns}
        autoHeight
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        slots={{ toolbar: GridToolbarFilterButton }}
      />
    </div>
  );
};

BookingsTable.PropTypes = {
  bookings: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  additionalColumns: PropTypes.array.isRequired,
};

export default BookingsTable;
