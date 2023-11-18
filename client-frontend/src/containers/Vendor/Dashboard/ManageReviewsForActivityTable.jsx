import {
  Dialog,
  DialogContent,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ManageReviewsForActivityTable = ({ reviews, handleToggle }) => {
  const [currentTabRows, setCurrentTabRows] = useState(reviews);
  const [selectedReview, setSelectedReview] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    setCurrentTabRows(reviews);
  }, [reviews]);

  const columns = [
    {
      field: "rating",
      flex: 1,
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Rating
          </Typography>
        );
      },
      renderCell: (params) => {
        const ratingValue = params.value;
        return (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Rating name="read-only" value={ratingValue} readOnly />
            <div>{ratingValue}</div>
          </Stack>
        );
      },
    },
    {
      field: "comment",
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Client Comment
          </Typography>
        );
      },
      flex: 1,
    },
    {
      field: "client",
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            By Client
          </Typography>
        );
      },
      flex: 1,
      renderCell: (params) => {
        return params.row.client.name;
      },
    },
    {
      field: "date",
      renderHeader: (params) => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Date Submitted
          </Typography>
        );
      },
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
  ];

  const handleRowClick = (params) => {
    setSelectedReview(params.row);
  };

  const handleClose = () => {
    setSelectedReview(null);
  };

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
      <Dialog open={selectedReview !== null} onClose={handleClose} fullWidth>
        <DialogContent>
          {selectedReview && (
            <div>
              <Typography variant="h6">Rating:</Typography>
              <Rating name="read-only" value={selectedReview.rating} readOnly />
              <Typography variant="h6">Comment:</Typography>
              <Typography>{selectedReview.comment}</Typography>
              <Typography variant="h6">By:</Typography>
              <Typography>{selectedReview.client.name}</Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

ManageReviewsForActivityTable.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ManageReviewsForActivityTable;
