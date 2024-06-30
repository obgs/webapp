"use client";

import styled from "@emotion/styled";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import { useAuth } from "modules/auth";
import onChangeText from "utils/onChangeText";

const Input = styled(TextField)`
  margin: 10px 0;
`;

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleChange =
    (setter: typeof setEmail) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeText(setter)(event);
      setError("");
    };

  const register = useCallback(async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
    }
  }, [password, confirmPassword, signup, email]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography>Sign up</Typography>
      <Input
        variant="outlined"
        label="Email"
        type="email"
        value={email}
        onChange={handleChange(setEmail)}
      />
      <Input
        variant="outlined"
        label="Password"
        type="password"
        value={password}
        onChange={handleChange(setPassword)}
      />
      <Input
        variant="outlined"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={handleChange(setConfirmPassword)}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Box mt={2}>
        <Button onClick={register} variant="contained">
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

export default Form;
