import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback } from "react";

import {
  PlayerSupervisionRequestFieldsFragment,
  useResolvePlayerSupervisionRequestMutation,
} from "../../../graphql/generated";
import useSnackbarError from "../../../utils/apollo/useSnackbarError";

interface Props {
  open: boolean;
  onClose: () => void;
  request: PlayerSupervisionRequestFieldsFragment;
}

const ResolvePlayerSupervisionRequestModal: React.FC<Props> = ({
  open,
  onClose,
  request,
}) => {
  const [resolve, { error }] = useResolvePlayerSupervisionRequestMutation();
  useSnackbarError(error);

  const playerName = request.player.name || request.player.id;
  const { enqueueSnackbar } = useSnackbar();
  const handleResolve = useCallback(
    (approved: boolean) => async () => {
      await resolve({
        variables: {
          input: {
            requestId: request.id,
            approved,
          },
        },
      });
      enqueueSnackbar(
        `Request for supervising ${playerName} ${
          approved ? "approved" : "rejected"
        }.`,
        { variant: "success" }
      );
      onClose();
    },
    [enqueueSnackbar, onClose, playerName, request.id, resolve]
  );

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
        p={3}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">
          Allow {request.sender.name || request.sender.id} supervision of{" "}
          {playerName}?
        </Typography>
        <Stack mt={2} direction="row" flex={1} justifyContent="space-between">
          <Button
            color="error"
            variant="contained"
            onClick={handleResolve(false)}
          >
            Reject
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={handleResolve(true)}
          >
            Allow
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ResolvePlayerSupervisionRequestModal;
