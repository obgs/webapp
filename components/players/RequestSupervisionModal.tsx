import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";

import {
  PlayerFieldsFragment,
  useRequestPlayerSupervisionMutation,
} from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";

interface Props {
  open: boolean;
  onClose: () => void;
  player: PlayerFieldsFragment;
}

const RequestPlayerSupervisionModal: React.FC<Props> = ({
  open,
  onClose,
  player,
}) => {
  const [message, setMessage] = useState("");

  const [request, { error, loading }] = useRequestPlayerSupervisionMutation();
  useSnackbarError(error);

  const playerName = player.name || player.id;
  const { enqueueSnackbar } = useSnackbar();
  const makeRequest = useCallback(async () => {
    await request({
      variables: {
        input: {
          playerId: player.id,
          message,
        },
      },
    });
    enqueueSnackbar(`Request for supervising ${playerName} sent.`, {
      variant: "success",
    });
    setMessage("");
    onClose();
  }, [enqueueSnackbar, message, onClose, player.id, playerName, request]);

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
          Requesting supervision of player <b>{playerName}</b>
        </Typography>
        <Box mt={2} mb={2}>
          <TextField
            label="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
          />
        </Box>

        <Stack
          direction="row"
          mt={2}
          mb={2}
          flex={1}
          justifyContent="space-between"
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={makeRequest}
          >
            Request
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RequestPlayerSupervisionModal;
