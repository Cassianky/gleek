import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  Button,
  FormControl,
  FormHelperText,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import OverviewCard from "./OverviewCard";

const ActivityProfitTable = ({
  rows,
  handleUpdate,
  handleStartDateChange,
  handleEndDateChange,
  startDate,
  endDate,
  rangeError,
}) => {
  const theme = useTheme();

  const calculateTotalProfit = () => {
    return rows.reduce((total, row) => {
      if (row.profit && !isNaN(row.profit)) {
        return total + row.profit;
      } else {
        return total;
      }
    }, 0);
  };

  const columns = [
    {
      field: "activityTitle",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Activity Title
          </Typography>
        );
      },
    },
    {
      field: "totalBookings",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
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
      field: "markup",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Markup %
          </Typography>
        );
      },
      valueFormatter: (params) => {
        return `${params.value}%`;
      },
    },
    {
      field: "totalRevenue",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Total Vendor Revenue
          </Typography>
        );
      },
      valueFormatter: (params) => {
        return `$${params.value?.toFixed(2)}`;
      },
    },
    {
      field: "totalClientCost",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Total Client Cost
          </Typography>
        );
      },
      valueFormatter: (params) => {
        return `$${params.value?.toFixed(2)}`;
      },
    },
    {
      field: "profit",
      flex: 1,
      renderHeader: () => {
        return (
          <Typography
            fontSize={"1rem"}
            sx={{ color: theme.palette.primary.main }}
          >
            Profit
          </Typography>
        );
      },
      valueFormatter: (params) => {
        return `$${params.value?.toFixed(2)}`;
      },
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Start Range"}
              views={["month", "year"]}
              value={dayjs(startDate)}
              onChange={handleStartDateChange}
            />
          </LocalizationProvider>
          <FormControl error={rangeError.length > 0}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={"End Range"}
                views={["month", "year"]}
                value={dayjs(endDate)}
                onChange={handleEndDateChange}
                minDate={dayjs(startDate)}
              />
            </LocalizationProvider>
            <FormHelperText>{rangeError}</FormHelperText>
          </FormControl>
          <Button onClick={handleUpdate}>Update</Button>
        </div>
        <OverviewCard
          sx={{ height: "100%" }}
          value={calculateTotalProfit()?.toFixed(2)}
          title="Total Profit"
          icon={<MonetizationOnIcon fontSize="medium" />}
          iconColor={theme.palette.yellow.main}
        />
      </div>

      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        getRowId={(row) => row.activityId}
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
      />
    </div>
  );
};

export default ActivityProfitTable;
