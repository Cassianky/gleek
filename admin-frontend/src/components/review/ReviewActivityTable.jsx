import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReviewsIcon from "@mui/icons-material/Reviews";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const ReviewActivityTable = ({ activities }) => {
  const [currentTabRows, setCurrentTabRows] = useState(activities);

  const navigate = useNavigate();

  const handleGoToReviews = (activity) => {
    navigate(`/reviews/activity/${activity._id}`);
  };

  useEffect(() => {
    const filteredActivities = activities.filter(
      (activity) => activity.approvalStatus === "Published",
    );
    setCurrentTabRows(filteredActivities);
  }, [activities]);

  // const handleRowClick = async (activity) => {
  //   const res = await AxiosConnect.get(`/activity/getImages/${activity._id}`);
  //   setImgs(res.data.activityImages);
  //   setVendorProfile(res.data.vendorProfileImage);
  //   setOpenViewModal(true);
  //   setSelectedActivity(activity);
  // };

  const columns = [];

  columns.push(
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "linkedVendor",
      headerName: "Hosted By",
      flex: 1,
      valueGetter: (params) => {
        return params.value?.companyName;
      },
    },
    {
      field: "activityType",
      headerName: "Activity Type",
      flex: 1,
      renderCell: (params) => <WrappedTextCell {...params} />,
    },
    {
      field: "theme",
      headerName: "Theme",
      flex: 1,
      valueGetter: (params) => {
        return params.value?.name;
      },
    },
    {
      field: "subtheme",
      headerName: "Learning Topics",
      flex: 1,
      valueGetter: (params) => {
        return params.value.map((x) => x.name);
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      valueFormatter: (params) => {
        return `${params.value} min`;
      },
    },

    {
      field: "modifiedDate",
      headerName: "Published",
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
              Published on&nbsp;
              <span style={{ color: "black" }}>
                {formattedDate} at {formattedTime}
              </span>
            </Typography>
          </div>
        );
      },
    },
    {
      field: "go",
      type: "actions",
      flex: 1,
      headerName: "View Reviews",
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
              onClick={() => handleGoToReviews(params.row)}
            >
              <ReviewsIcon />
            </Button>
          </div>
        );
      },
    },
  );

  return (
    <Box>
      <div style={{ height: 600, width: "99%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 100, page: 0 },
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
          disableRowSelectionOnClick
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
ReviewActivityTable.propTypes = {
  activities: PropTypes.array.isRequired,
};
export default ReviewActivityTable;
