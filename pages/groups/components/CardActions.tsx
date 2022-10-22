import { LoadingButton } from "@mui/lab";
import { CardActions } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback } from "react";

import {
  GroupFieldsFragment,
  GroupFieldsFragmentDoc,
  GroupSettingsJoinPolicy,
  useJoinGroupMutation,
} from "../../../graphql/generated";
import useSnackbarError from "../../../utils/apollo/useSnackbarError";
import useAuth from "../../../utils/auth/useAuth";

interface Props {
  group: GroupFieldsFragment;
}

const GroupCardActions: React.FC<Props> = ({ group }) => {
  const { authenticated } = useAuth();

  const [joinGroup, { error, loading }] = useJoinGroupMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const handleJoinGroup = useCallback(async () => {
    await joinGroup({
      variables: {
        id: group.id,
      },
      update: (cache) => {
        const fragment = cache.readFragment<GroupFieldsFragment>({
          id: `Group:${group.id}`,
          fragment: GroupFieldsFragmentDoc,
        });
        cache.writeFragment({
          id: `Group:${group.id}`,
          fragment: GroupFieldsFragmentDoc,
          data: {
            ...fragment,
            isMember: true,
            members: {
              ...fragment?.members,
              totalCount: (fragment?.members.totalCount || 0) + 1,
            },
          },
        });
      },
    });
    enqueueSnackbar(`Joined group ${group.name}.`, { variant: "success" });
  }, [group, joinGroup, enqueueSnackbar]);

  if (!authenticated || group.isMember) {
    return null;
  }

  let joinButton: React.ReactNode = null;

  if (group.settings.joinPolicy === GroupSettingsJoinPolicy.Open) {
    joinButton = (
      <LoadingButton
        onClick={handleJoinGroup}
        variant="contained"
        loading={loading}
      >
        Join
      </LoadingButton>
    );
  }
  if (group.settings.joinPolicy === GroupSettingsJoinPolicy.ApplicationOnly) {
    joinButton = (
      <LoadingButton variant="contained" loading={false}>
        Apply
      </LoadingButton>
    );
  }

  return <CardActions>{joinButton}</CardActions>;
};

export default GroupCardActions;
