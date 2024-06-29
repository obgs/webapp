import { Container, Typography } from "@mui/material";
import React from "react";

import Form from "../components/Form";

export const metadata = {
  title: "New group",
};

const CreateGroup = () => {
  return (
    <Container>
      <Typography variant="h4">Create a new group</Typography>
      <Form buttonLabel="Create" />
    </Container>
  );
};

export default CreateGroup;
