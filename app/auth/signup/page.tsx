import { Container } from "@mui/material";
import React from "react";

import Form from "./form";

const Signup = () => {
  return (
    <Container
      sx={{
        paddingTop: "40px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Form />
    </Container>
  );
};

export default Signup;
