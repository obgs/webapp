import { Container } from "@mui/material";
import React from "react";

import List from "@/groups/components/List";

export const metadata = {
  title: "Browse groups",
};

const Browse = () => {
  return (
    <Container>
      <List />
    </Container>
  );
};

export default Browse;
