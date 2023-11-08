import { useEffect } from "react";
import * as echarts from "echarts";

const Chart = ({ options }) => {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const chartDom = document.getElementById("chart");
    const chart = echarts.init(chartDom);
    chart.setOption(options);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chart" style={{ width: "100%", height: "400px" }}></div>;
};

export default Chart;
