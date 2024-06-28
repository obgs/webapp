import { Container } from "@mui/material";
import React from "react";

import List from "./components/List";

export const metadata = {
  title: "OBGS | Browse groups",
};

const Browse = () => {
  return (
    <Container>
      <List />
    </Container>
  );
};

export default Browse;
