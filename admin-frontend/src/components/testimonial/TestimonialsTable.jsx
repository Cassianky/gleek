import { Article } from "@mui/icons-material";
import { Button, Switch, Typography } from "@mui/material";

import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TestimonialsTable = ({ testimonials, handleToggle }) => {
  const [currentTabRows, setCurrentTabRows] = useState(testimonials);
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTabRows(testimonials);
  }, [testimonials]);

  const columns = [
    {
      field: "testimonialBody",
      headerName: "Client Testimonial",
      flex: 1,
    },
    {
      field: "displayName",
      headerName: "Client Display Name",
      flex: 1,
    },
    {
      field: "created",
      headerName: "Created",
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
              Created on&nbsp;
              <span style={{ color: "black" }}>
                {formattedDate} at {formattedTime}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "updated",
      headerName: "Updated",
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
              Updated on&nbsp;
              <span style={{ color: "black" }}>
                {formattedDate} at {formattedTime}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "survey",
      flex: 1,
      type: "actions",
      headerName: "Original Survey",
      renderCell: (params) => {
        const survey = params.row.survey;
        const surveyId = survey._id;
        const surveyLink = `/surveys/${surveyId}`;
        return (
          <Button color="light_purple" href={surveyLink}>
            <Article />
          </Button>
        );
      },
    },

    {
      field: "hidden",
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
  ];

  const handleRowClick = (params) => {
    navigate(`${params.row._id}`);
  };

  const handleClose = () => {
    setSelectedReview(null);
  };

  return (
    <Box>
      <div style={{ height: 800, width: "99%" }}>
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
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          onRowClick={handleRowClick}
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

TestimonialsTable.propTypes = {
  testimonials: PropTypes.array.isRequired,
};

export default TestimonialsTable;
