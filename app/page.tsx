import { Container, Typography } from "@mui/material";
import { ChartData, ChartOptions } from "chart.js";

import ChartjsCanvas from "components/ChartjsCanvas";

export const metadata = {
  title: "OBGS | Home",
};

export default function HomePage() {
  const data: ChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  // Optional configuration options for the chart
  const options: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
  };

  return (
    <Container sx={{ flex: 1 }}>
      <Typography variant="h4">Welcome to the new OBGS webapp</Typography>
      <Typography variant="body1">
        This app is a work in progress. Please check back later.
      </Typography>
      <ChartjsCanvas data={data} options={options} />
    </Container>
  );
}
