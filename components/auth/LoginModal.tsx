import styled from "@emotion/styled";
import { Box, Button, Link, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import NextLink from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Input = styled(TextField)`
  margin: 10px 0;
`;

const LoginModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>Log in</Typography>
        <Input variant="outlined" label="Email" type="email" />
        <Input variant="outlined" label="Password" type="password" />
        <Box mt={2} mb={2}>
          <Button fullWidth variant="contained">
            Log in
          </Button>
        </Box>
        <Typography>
          Not registered? Sign up{" "}
          <NextLink href="/auth/signup" passHref>
            <Link sx={{ cursor: "pointer" }}>here</Link>
          </NextLink>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
