import { LoadingButton } from "@mui/lab";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";

import {
  GroupFieldsFragment,
  useApplyToGroupMutation,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";
import onChangeText from "utils/onChangeText";

interface Props {
  open: boolean;
  onClose: () => void;
  group: GroupFieldsFragment;
}

const ApplicationModal: React.FC<Props> = ({ open, onClose, group }) => {
  const [message, setMessage] = useState("");
  const [apply, { error, loading }] = useApplyToGroupMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const handleApply = useCallback(async () => {
    await apply({
      variables: {
        input: {
          groupId: group.id,
          message,
        },
      },
    });
    enqueueSnackbar(`You applied to group ${group.name}.`, {
      variant: "success",
    });
    onClose();
  }, [apply, enqueueSnackbar, group, message, onClose]);

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
        p={5}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography>
          You are applying to join the <b>{group.name}</b> group.
        </Typography>
        <Typography>
          Provide a message for their admins with a reason for your application.
        </Typography>
        <Box mt={2}>
          <TextField
            value={message}
            onChange={onChangeText(setMessage)}
            label="Message (optional)"
            multiline
            fullWidth
          />
        </Box>
        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <LoadingButton
            variant="outlined"
            loading={loading}
            onClick={handleApply}
          >
            Apply
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplicationModal;
