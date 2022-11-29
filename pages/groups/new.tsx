import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";

import GroupForm, { SubmitCallback } from "../../components/groups/GroupForm";

const CreateGroup = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSubmit: SubmitCallback = async ({ name }) => {
    enqueueSnackbar(`Group ${name} created.`, { variant: "success" });
    router.push("/groups");
  };

  return (
    <Container>
      <Typography variant="h4">Create a new group</Typography>
      <GroupForm onSubmit={onSubmit} buttonLabel="Create" />
    </Container>
  );
};

export default CreateGroup;
