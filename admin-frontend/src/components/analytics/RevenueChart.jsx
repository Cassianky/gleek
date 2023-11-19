import { Card, CardContent, CardHeader } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import Chart from "./chart/RevenueChartInstance";

const RevenueChart = ({ data }) => {
  const theme = useTheme();
  const font = theme.typography.fontFamily;
  const months = [
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
  ];
  const formattedDates = data?.map(({ currentMonth, currentYear }) => {
    const monthName = months[currentMonth];
    return `${monthName} ${currentYear}`;
  });
  const predefinedMonthRange = data?.map(({ currentMonth, currentYear }) => {
    return { month: currentMonth, year: currentYear };
  });

  const activityIdProfitsMap = {};

  data?.forEach(({ currentMonth, currentYear, activity }) => {
    activity.forEach(({ activityId, profit, activityTitle }) => {
      const key = activityId;
      if (!activityIdProfitsMap[key]) {
        activityIdProfitsMap[key] = {
          profits: Array(predefinedMonthRange.length).fill(0),
          activityTitle,
        };
      }
      const monthIndex = predefinedMonthRange.findIndex(
        ({ month, year }) => month === currentMonth && year === currentYear,
      );
      if (monthIndex !== -1) {
        activityIdProfitsMap[key].profits[monthIndex] = profit;
      }
    });
  });

  const resultArray = Object.entries(activityIdProfitsMap).map(
    ([activityId, { profits, activityTitle }]) => ({
      activityId,
      activityTitle,
      profits,
    }),
  );
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
      data: formattedDates,
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
    series: resultArray.map(({ activityId, profits, activityTitle }) => ({
      name: activityTitle,
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      data: profits,
    })),
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
        title="Profit"
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
