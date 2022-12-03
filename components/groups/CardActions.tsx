import CheckIcon from "@mui/icons-material/Check";
import { LoadingButton } from "@mui/lab";
import { Button, CardActions, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";

import {
  GroupFieldsFragment,
  GroupFieldsFragmentDoc,
  GroupMembershipRole,
  GroupSettingsJoinPolicy,
  useJoinGroupMutation,
} from "../../graphql/generated";
import GroupMembershipApplicationModal from "./ApplicationModal";
import { useAuth } from "modules/auth";
import { useSnackbarError } from "utils/apollo";

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
        if (!fragment) return;
        cache.writeFragment<GroupFieldsFragment>({
          id: `Group:${group.id}`,
          fragment: GroupFieldsFragmentDoc,
          data: {
            ...fragment,
            role: GroupMembershipRole.Member,
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
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  if (!authenticated || group.role) {
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
  if (
    [
      GroupSettingsJoinPolicy.ApplicationOnly,
      GroupSettingsJoinPolicy.InviteOrApplication,
    ].includes(group.settings.joinPolicy)
  ) {
    joinButton = group.applied ? (
      <Tooltip title="You have already applied to join this group">
        <Button variant="contained" color="success" startIcon={<CheckIcon />}>
          Applied
        </Button>
      </Tooltip>
    ) : (
      <LoadingButton
        variant="contained"
        loading={false}
        onClick={() => setApplyModalOpen(true)}
      >
        Apply
      </LoadingButton>
    );
  }

  return (
    <>
      <CardActions>{joinButton}</CardActions>
      <GroupMembershipApplicationModal
        group={group}
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </>
  );
};

export default GroupCardActions;
