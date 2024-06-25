import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";

import Form, { SubmitCallback } from "./components/Form";
import { Title } from "modules/nav";

const CreateGroup = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSubmit: SubmitCallback = async ({ name }) => {
    enqueueSnackbar(`Group ${name} created.`, { variant: "success" });
    router.push("/groups");
  };

  return (
    <Container>
      <Title text="New group" />
      <Typography variant="h4">Create a new group</Typography>
      <Form onSubmit={onSubmit} buttonLabel="Create" />
    </Container>
  );
};

export default CreateGroup;
