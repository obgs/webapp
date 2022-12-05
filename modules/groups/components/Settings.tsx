import { Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useMemo } from "react";

import { useGroupSettingsQuery } from "../../../graphql/generated";
import Form, { SubmitCallback } from "./Form";

interface Props {
  groupId: string;
}

const Settings: React.FC<Props> = ({ groupId }) => {
  const { data, error, loading } = useGroupSettingsQuery({
    variables: {
      id: groupId,
    },
  });

  const group = useMemo(
    () => (data?.node?.__typename === "Group" ? data?.node : undefined),
    [data?.node]
  );

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit: SubmitCallback = useCallback(
    async ({ name }) => {
      enqueueSnackbar(`Group ${name} updated.`, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  if (error) {
    return <Alert severity="error">Error loading group settings</Alert>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <Form
      onSubmit={onSubmit}
      buttonLabel="Update"
      id={group.id}
      initialValues={{
        name: group.name,
        description: group.description,
        logoURL: group.logoURL,
        visibility: group.settings.visibility,
        joinPolicy: group.settings.joinPolicy,
        minimumRoleToInvite: group.settings.minimumRoleToInvite,
      }}
    />
  );
};

export default Settings;
