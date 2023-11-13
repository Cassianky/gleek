import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import TaskIcon from "@mui/icons-material/Task";
import {
  AppBar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import AxiosConnect from "../../utils/AxiosConnect";
import {
  useActivityStore,
  useAdminStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import { Navigate, useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
  },
}));

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const FeaturedActivitiesTable = ({ activities, pendingApprovalActivities }) => {
  const [currentTabRows, setCurrentTabRows] = useState(activities);
  const [selectedActivity, setSelectedActivity] = useState();
  const [imgs, setImgs] = useState([]);
  const [vendorProfile, setVendorProfile] = useState();
  const {
    selectedActivityTab,
    setSelectedActivityTab,
    approveActivity,
    rejectActivity,
    setPendingApprovalActivities,
  } = useActivityStore();

  const navigate = useNavigate();

  const { openSnackbar } = useSnackbarStore();
  const { admin } = useAdminStore();
  const filterCriteria = {
    publishedTab: { approvalStatus: "Published" },
    pendingApprovalTab: { approvalStatus: "Pending Approval" },
  };

  useEffect(() => {
    setCurrentTabRows(activities);
  }, [activities]);

  const handleRowClick = async (activity) => {
    navigate(`/featured/${activity._id}`);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedActivityTab(newValue);
    const filteredRows =
      filterCriteria[selectedActivityTab].approvalStatus === "Published"
        ? activities
        : pendingApprovalActivities;
    setCurrentTabRows(filteredRows);
  };

  const publishedBadgeNumber = Array.isArray(activities)
    ? activities.length
    : null;
  const pendingApprovalBadgeNumber = Array.isArray(pendingApprovalActivities)
    ? pendingApprovalActivities.length
    : null;
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
          onRowClick={(params) => handleRowClick(params.row)}
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
// FeaturedActivitiesTable.propTypes = {
//   activities: PropTypes.array.isRequired,
//   pendingApprovalActivities: PropTypes.array.isRequired,
// };
export default FeaturedActivitiesTable;
