import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";

import GroupForm, { SubmitCallback } from "../../components/groups/GroupForm";
import {
  SearchGroupsDocument,
  useCreateGroupMutation,
} from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";

const CreateGroup = () => {
  const [createGroup, { loading, error }] = useCreateGroupMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSubmit: SubmitCallback = async ({
    name,
    description,
    logoURL,
    visibility,
    joinPolicy,
    minimumRoleToInvite,
  }) => {
    await createGroup({
      variables: {
        name,
        description,
        logoUrl: logoURL,
        visibility,
        joinPolicy,
        minimumRoleToInvite,
      },
      // updating the cache manually would be harder, so we just refetch the whole list
      refetchQueries: [
        {
          query: SearchGroupsDocument,
          variables: { where: {}, first: 10 },
        },
      ],
    });
    enqueueSnackbar(`Group ${name} created.`, { variant: "success" });
    router.push("/groups");
  };

  return (
    <Container>
      <GroupForm onSubmit={onSubmit} loading={loading} buttonLabel="Create" />
    </Container>
  );
};

export default CreateGroup;
