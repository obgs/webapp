import { Container, Typography } from "@mui/material";

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
    </Container>
  );
}
