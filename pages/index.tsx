import { Container, Typography } from "@mui/material";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Container sx={{ flex: 1 }}>
      <Typography variant="h4">Welcome to the new OBGS webapp</Typography>
      <Typography variant="body1">
        This app is a work in progress. Please check back later.
      </Typography>
    </Container>
  );
};

export default Home;
