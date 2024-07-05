import { Container, Typography } from "@mui/material";

import Barchart from "@/charts/Bar";
import LinePlot from "@/charts/LinearPlot";

export const metadata = {
  title: "OBGS | Home",
};

export default function HomePage() {
  return (
    <Container sx={{ flex: 1 }}>
      <Typography variant="h4">Welcome to the new OBGS webapp</Typography>
      <Typography variant="body1">
        This app is a work in progress. Please check back later.
      </Typography>
      <LinePlot data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
      <Barchart />
    </Container>
  );
}
