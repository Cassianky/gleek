import { useEffect } from "react";
import * as echarts from "echarts";

const BookingChart = ({ options }) => {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const chartDom = document.getElementById("chart2");
    const chart = echarts.init(chartDom);
    chart.setOption(options);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chart2" style={{ width: "100%", height: "400px" }}></div>;
};

export default BookingChart;
