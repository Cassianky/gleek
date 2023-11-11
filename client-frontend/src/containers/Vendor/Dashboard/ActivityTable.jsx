import { Chip, Rating, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";

const ActivityTable = ({ rows, handleOpen }) => {
  const theme = useTheme();

  const handleRowClick = (params) => {
    handleOpen(params);
  };

  const columns = [
    {
      field: "activity",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Activity Title
          </Typography>
        );
      },
      valueGetter: (params) => {
        return params.value.title;
      },
    },
    {
      field: "numberOfBookings",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Number of Bookings
          </Typography>
        );
      },
      valueGetter: (params) => {
        return params?.value;
      },
    },
    {
      field: "reviewSentimentScore",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Overall Sentiment
          </Typography>
        );
      },
      renderCell: (params) => {
        let overallSentiment;
        let color;
        if (params.value < 0) {
          overallSentiment = "Negative";
          color = theme.palette.error.main;
        } else if (params.value > 0) {
          overallSentiment = "Positive";
          color = theme.palette.light_green.main;
        } else {
          overallSentiment = "Neutral";
          color = theme.palette.grey[200];
        }
        return (
          <div style={{ display: "flex", paddingTop: 2, paddingBottom: 2 }}>
            <Chip
              label={
                <Typography fontSize={"0.875rem"}>
                  {overallSentiment}
                </Typography>
              }
              sx={{ backgroundColor: color }}
            />
          </div>
        );
      },
    },
    {
      field: "numberOfReviews",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Number of Reviews
          </Typography>
        );
      },
      valueGetter: (params) => {
        return params.value;
      },
    },
    {
      field: "avgReviewRating",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.secondary.main }}
          >
            Average Rating
          </Typography>
        );
      },
      renderCell: (params) => {
        return (
          <Rating
            max={5}
            readOnly
            required
            name="rating"
            value={params.value}
          />
        );
      },
    },
  ];
  return (
    <div style={{ height: 500, width: "99%" }}>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        getRowId={(row) => row.activity._id}
        rows={rows}
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
  );
};

export default ActivityTable;
