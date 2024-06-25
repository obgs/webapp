import { Container, Typography } from "@mui/material";

import { Title } from "modules/nav";

const Home = () => {
  return (
    <Container sx={{ flex: 1 }}>
      <Title text="Home" />
      <Typography variant="h4">Welcome to the new OBGS webapp</Typography>
      <Typography variant="body1">
        This app is a work in progress. Please check back later.
      </Typography>
    </Container>
  );
};

export default Home;
