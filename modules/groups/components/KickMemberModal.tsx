import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback } from "react";

import {
  GroupMembershipFieldsFragment,
  useKickUserFromGroupMutation,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

interface Props {
  open: boolean;
  member: GroupMembershipFieldsFragment;
  groupId: string;
  onClose: () => void;
}

const KickMemberModal: React.FC<Props> = ({
  open,
  member,
  groupId,
  onClose,
}) => {
  const [kick, { error, loading }] = useKickUserFromGroupMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const onConfirm = useCallback(async () => {
    await kick({
      variables: {
        userId: member.user.id,
        groupId,
      },
      update: (cache) => {
        cache.evict({ id: `GroupMembership:${member.id}` });
      },
    });
    enqueueSnackbar(
      `Kicked ${member.user.name || member.user.id} from the group.`,
      {
        variant: "success",
      }
    );
    onClose();
  }, [enqueueSnackbar, groupId, kick, member, onClose]);

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
      <Card>
        <CardContent>
          <Typography>
            Are you sure you want to kick {member.user.name || member.user.id}?
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton onClick={onConfirm} loading={loading} color="error">
            Kick
          </LoadingButton>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default KickMemberModal;
