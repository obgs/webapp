import styled from "@emotion/styled";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React from "react";

const Input = styled(TextField)`
  margin: 10px 0;
`;

const Signup = () => {
  return (
    <Container sx={{ paddingTop: "40px" }}>
      <Typography>Sign up</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Input variant="outlined" label="Email" type="email" />
        <Input variant="outlined" label="Password" type="password" />
        <Input variant="outlined" label="Confirm password" type="password" />
        <Button variant="contained">Sign up</Button>
      </Box>
    </Container>
  );
};

export default Signup;
