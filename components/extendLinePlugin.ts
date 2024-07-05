import { Plugin as ChartPlugin } from "chart.js/auto";

export const extendLinePlugin: ChartPlugin = {
  id: "extendLine",
  afterDatasetDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const yScale = chart.scales["y"];
    const xScale = chart.scales["x"];

    const originalLineData = chart.data.datasets[0].data;
    ctx.save();

    // Draw left extension
    ctx.beginPath();
    ctx.moveTo(chartArea.left, yScale.getPixelForValue(originalLineData[0]));
    ctx.lineTo(
      xScale.getPixelForValue("January"),
      yScale.getPixelForValue(originalLineData[0])
    );
    ctx.strokeStyle = "rgb(255, 99, 132)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw right extension
    ctx.beginPath();
    ctx.moveTo(
      xScale.getPixelForValue("July"),
      yScale.getPixelForValue(originalLineData[originalLineData.length - 1])
    );
    ctx.lineTo(
      chartArea.right,
      yScale.getPixelForValue(originalLineData[originalLineData.length - 1])
    );
    ctx.strokeStyle = "rgb(255, 99, 132)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  },
};
