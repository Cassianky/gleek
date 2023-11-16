import { Button, Card, CardContent, CardHeader, SvgIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import BookingChart from "./chart/BookingChartInstance";

const BookingsChart = ({ data }) => {
  const theme = useTheme();
  const font = theme.typography.fontFamily;
  const options = {
    legend: { textStyle: { fontFamily: font } },
    tooltip: {},
    xAxis: {
      type: "category",
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      nameTextStyle: { fontFamily: font, fontSize: "1rem" },
      name: "Month",
      axisLabel: { fontFamily: font, fontSize: "0.825rem" },
    },
    yAxis: {
      type: "value",
      nameTextStyle: { fontFamily: font, fontSize: "1rem" },
      name: "Bookings",
      axisLabel: {
        fontFamily: font,
        fontSize: "0.825rem",
      },
    },
    series: data
      ? Object.keys(data).map((activityId) => ({
          name: activityId,
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: data[activityId],
        }))
      : [],
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
        border: "0px solid rgb(159 145 204 / 40%)",
        backgroundColor: "white",
      }}
    >
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={
              <SvgIcon fontSize="small">{/* <ArrowPathIcon /> */}</SvgIcon>
            }
          >
            Sync
          </Button>
        }
        title="Number of bookings"
        style={{ color: theme.palette.primary.main }}
      />
      <CardContent>
        <BookingChart
          height={350}
          type="bar"
          width="100%"
          options={options}
          id="booking"
        />
      </CardContent>
    </Card>
  );
};

BookingsChart.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
};

export default BookingsChart;
