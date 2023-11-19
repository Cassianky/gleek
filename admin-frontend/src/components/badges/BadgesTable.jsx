import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React from "react";
import { useBadgeStore, useSnackbarStore } from "../../zustand/GlobalStore";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

const BadgesTable = ({ badges }) => {
  const navigate = useNavigate();
  const { setCurrentBadge, deleteBadge } = useBadgeStore();
  const { openSnackbar } = useSnackbarStore();
  let containerStyle = {
    minHeight: "10rem", // Default for extra-large screens
    width: "10rem",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
    borderBottomLeftRadius: "4px",
    borderRadius: "4px",
  };
  const handleDelete = async (badge) => {
    try {
      console.log(badge._id);
      const responseStatus = await deleteBadge(badge._id);

      if (responseStatus) {
        openSnackbar("Badge Deletion was successful!", "success");
        navigate(-1);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.msg;
      openSnackbar(errorMessage, "error");
    }
  };
  const columns = [
    {
      field: "name",
      flex: 1,
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Badge Name</Typography>;
      },
      renderCell: (params) => {
        console.log(params.row);
        const title = params.value;
        const preSignedImage = params.row.badgePreSignedImage;
        return (
          <Box display="flex" flexDirection="column" p={2}>
            <Typography textAlign="center">{title}</Typography>
            <Box display="flex" justifyContent="center" width={"100%"}>
              {/* Apply styling to the image */}
              {preSignedImage && (
                <img src={preSignedImage} alt={title} style={containerStyle} />
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "Badge Type",
      flex: 1,
      renderCell: (params) => {
        const vendorName = params.row.sdgBadgeType;
        return <div style={{ display: "flex" }}>{vendorName}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Badge Type</Typography>;
      },
    },
    {
      field: "creationDate",
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
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Creation Date</Typography>;
      },
    },
    {
      field: "caption",
      flex: 1,
      renderCell: (params) => {
        const caption = params.row.caption;
        return <div style={{ display: "flex" }}>{caption}</div>;
      },
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Caption</Typography>;
      },
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      renderHeader: (params) => {
        return <Typography fontSize={"1rem"}>Actions</Typography>;
      },
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              paddingTop: 3,
              paddingBottom: 3,
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="contained"
              onClick={() => handleRowClick(params.row)}
              startIcon={<InfoIcon />}
              sx={{ marginBottom: 3 }}
            >
              Details
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleDelete(params.row)}
              startIcon={<DeleteIcon />}
              sx={{ marginBottom: 3 }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const handleRowClick = (badge) => {
    navigate(`/badgeDetails/${badge._id.toString()}`);
    setCurrentBadge(badge);
  };

  return (
    <Box>
      <div style={{ height: 600, width: "99%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={badges}
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
    </Box>
  );
};

BadgesTable.propTypes = {
  badges: PropTypes.array.isRequired,
};

export default BadgesTable;
