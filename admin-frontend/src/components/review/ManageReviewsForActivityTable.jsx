import { Button, Rating, Typography, Stack, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReviewsIcon from "@mui/icons-material/Reviews";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  useActivityStore,
  useAdminStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const ManageReviewsForActivityTable = ({ reviews, handleToggle }) => {
  const [currentTabRows, setCurrentTabRows] = useState(reviews);

  useEffect(() => {
    setCurrentTabRows(reviews);
  }, [reviews]);

  const columns = [];

  columns.push(
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      renderCell: (params) => {
        const ratingValue = params.value;
        return (
          <Stack
            direction="row"
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Rating name="read-only" value={ratingValue} readOnly />
            <div>{ratingValue}</div>
          </Stack>
        );
      },
    },
    {
      field: "comment",
      headerName: "Client Comment",
      flex: 1,
    },

    {
      field: "date",
      headerName: "Date Submitted",
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
              Submitted on&nbsp;
              <span style={{ color: "black" }}>
                {formattedDate} at {formattedTime}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerName: "Shown",
      renderCell: (params) => {
        const isChecked = !params.row.hidden;
        return (
          <div
            style={{
              display: "flex",
              paddingTop: 3,
              paddingBottom: 3,
              alignItems: "center",
            }}
          >
            <Switch
              color="primary"
              checked={isChecked}
              onChange={() => handleToggle(params.row._id)}
            />
          </div>
        );
      },
    },
  );

  return (
    <Box>
      <div style={{ height: 500, width: "99%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={currentTabRows}
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
          getRowHeight={() => "auto"}
          // onRowClick={(params) => handleRowClick(params.row)}
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
    </Box>
  );
};
ManageReviewsForActivityTable.propTypes = {
  reviews: PropTypes.array.isRequired,
};
export default ManageReviewsForActivityTable;
