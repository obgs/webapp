import { Container, Typography } from "@mui/material";
import React from "react";

import GameList from "./GameList";

export const metadata = {
  title: "Browse games",
};

const Browse = () => {
  return (
    <Container>
      <Typography variant="body1">
        Games are the templates for your statistics. They are created and
        maintained by community members. You can create your own games or use
        existing ones.
      </Typography>
      <GameList />
    </Container>
  );
};

export default Browse;
