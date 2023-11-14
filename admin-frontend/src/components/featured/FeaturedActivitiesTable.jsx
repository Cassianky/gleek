import { Schedule, Star } from "@mui/icons-material";
import HistoryToggleOff from '@mui/icons-material/HistoryToggleOff';
import {
  Chip
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const FeaturedActivitiesTable = ({ activities }) => {
  const [currentTabRows, setCurrentTabRows] = useState(activities);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTabRows(activities);
  }, [activities]);

  const handleRowClick = async (activity) => {
    navigate(`/featured/${activity._id}`);
  };


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
    }, {
      field: "featureStatus",
      headerName: "Featured Status",
      flex: 1,
      renderCell: (params) => {
        const featureStatus = params.value;
        let chipIcon;
        let chipColor;
  
        switch (featureStatus) {
          case "Active":
            chipIcon = <Star />;
            chipColor = "success";
            break;
          case "Sometimes Active":
            chipIcon = <Schedule />;
            chipColor = "info";
            break;
          default:
            chipIcon = <HistoryToggleOff />;
            chipColor = "default";
        }
  
        return <Chip icon={chipIcon} label={featureStatus} color={chipColor} />;
      }
    }
  );

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
