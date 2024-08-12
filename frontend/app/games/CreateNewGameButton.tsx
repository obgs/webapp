"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

import { useAuth } from "modules/auth";

const CreateNewGameButton = () => {
  const { authenticated } = useAuth();
  const router = useRouter();
  if (!authenticated) return null;

  return (
    <Button
      variant="contained"
      sx={{ mb: 1 }}
      onClick={() => router.push("/games/new")}
    >
      Create new game
    </Button>
  );
};

export default CreateNewGameButton;
