"use client";

// MyChart.tsx
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import React, { useRef, useEffect } from "react";

// Define the props for the component
interface ChartjsCanvasProps {
  data: ChartData;
  options?: ChartOptions;
  type?:
    | "bar"
    | "line"
    | "pie"
    | "doughnut"
    | "radar"
    | "polarArea"
    | "bubble"
    | "scatter"; // Add other types as needed
}

const ChartjsCanvas: React.FC<ChartjsCanvasProps> = ({
  data,
  options,
  type = "bar",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Get the context of the canvas element we want to select
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Initialize the chart
        const myChart = new Chart(ctx, {
          type,
          data,
          options,
        });

        // Clean up on component unmount
        return () => {
          myChart.destroy();
        };
      }
    }
  }, [data, options, type]);

  return <canvas ref={canvasRef} />;
};

export default ChartjsCanvas;
