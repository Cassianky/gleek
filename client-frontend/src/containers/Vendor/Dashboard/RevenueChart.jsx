import { Card, CardContent, CardHeader } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import Chart from "./chart/RevenueChartInstance";

const RevenueChart = ({ data }) => {
  const theme = useTheme();
  const font = theme.typography.fontFamily;
  const options = {
    toolbox: {
      feature: {
        saveAsImage: { show: true },
        magicType: {
          type: ["stack"],
        },
      },
    },
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
      name: "Revenue",
      axisLabel: {
        fontFamily: font,
        fontSize: "0.825rem",
        formatter: "$ {value}",
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
        title="Revenue"
        style={{ color: theme.palette.primary.main }}
      />
      <CardContent>
        <Chart height={350} type="bar" width="100%" options={options} />
      </CardContent>
    </Card>
  );
};

RevenueChart.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
};

export default RevenueChart;
