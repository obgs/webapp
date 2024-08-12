import styled from "@emotion/styled";
import {
  Alert,
  Box,
  Button,
  Link,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";

import useAuth from "./useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Input = styled(TextField)`
  margin: 10px 0;
`;

const LoginModal: React.FC<Props> = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signin, googleSignin } = useAuth();

  const login = async () => {
    setError("");
    try {
      await signin(email, password);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
    }
  };

  const oAuthGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      try {
        await googleSignin(tokenResponse.access_token);
        onClose();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        console.error(err);
      }
    },
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError("");
  };

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
          bgcolor: "background.paper",
          borderRadius: "10px",
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>Log in</Typography>
        <Input
          variant="outlined"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <Input
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={2} mb={2}>
          <Button onClick={login} fullWidth variant="contained">
            Log in
          </Button>
        </Box>
        <Box mb={2}>
          <Button onClick={() => oAuthGoogle()} fullWidth variant="contained">
            Log in with google
          </Button>
        </Box>
        <Typography>
          Not registered? Sign up{" "}
          <Link
            sx={{ cursor: "pointer" }}
            href="/auth/signup"
            onClick={onClose}
          >
            here
          </Link>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
