import { Container } from "@mui/material";
import React from "react";

import Form from "./Form";

export const metadata = {
  title: "New game",
};

const CreateGame = () => {
  return (
    <Container>
      <Form />
    </Container>
  );
};

export default CreateGame;
