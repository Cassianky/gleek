import { useTheme, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const BadgeRecordsTable = ({ badgeRecords }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const columns = [
    {
      field: "clientId",
      flex: 1.5,
      renderCell: (params) => {
        const clientId = params.row.client._id;
        return <div style={{ display: "flex" }}>{clientId}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Client ID</Typography>;
      },
    },
    {
      field: "clientName",
      flex: 1,
      renderCell: (params) => {
        const clientName = params.row.client.name;
        return <div style={{ display: "flex" }}>{clientName}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Client Name</Typography>;
      },
    },
    {
      field: "client",
      flex: 1,
      renderCell: (params) => {
        const clientName = params.row.client.companyName;
        return <div style={{ display: "flex" }}>{clientName}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Company Name</Typography>;
      },
    },
    {
      field: "updated",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });
        const formattedTime = date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return (
          <div style={{ display: "flex" }}>
            <Typography color="#9F91CC" fontSize={"0.875rem"}>
              <span style={{ color: "black" }}>
                {formattedDate} at {formattedTime}
              </span>
            </Typography>
          </div>
        );
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Updated Date</Typography>;
      },
    },
    {
      field: "isCompleted",
      flex: 1,
      renderCell: (params) => {
        const caption = params.row.isCompleted.toString();
        return <div style={{ display: "flex" }}>{caption}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Is Completed</Typography>;
      },
    },
    {
      field: "threshold",
      flex: 1,
      renderCell: (params) => {
        let threshold = "";
        if (params.row.sdgCount !== undefined) {
          threshold = params.row.sdgCount;
        } else if (params.row.bookingCount !== undefined) {
          threshold = params.row.bookingCount;
        } else {
          threshold = "BRONZE";
        }
        return <div style={{ display: "flex" }}>{threshold}</div>;
      },
      renderHeader: (params) => {
        return (
          <Typography fontSize={"1rem"}>Threshold / Badge Type</Typography>
        );
      },
    },
  ];

  const handleRowClick = ({ _id }) => {
    navigate(`/badgeDetails/${_id.toString()}`);
  };

  return (
    <Box>
      <Typography
        color={theme.palette.primary.main}
        paddingTop={2}
        component="div"
        fontSize={"1.25rem"}
        fontWeight={700}
      >
        Badge Records Table
      </Typography>
      <div style={{ height: 600, width: "99%", padding: 2 }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={badgeRecords}
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
      </div>
    </Box>
  );
};

BadgeRecordsTable.propTypes = {
  badgeRecords: PropTypes.array.isRequired,
};

export default BadgeRecordsTable;
