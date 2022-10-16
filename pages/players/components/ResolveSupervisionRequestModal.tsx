import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import {
  PlayerSupervisionRequestFieldsFragment,
  useResolvePlayerSupervisionRequestMutation,
} from "../../graphql/generated";

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
      onClose();
    },
    [onClose, request.id, resolve]
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
          {request.player.name || request.player.id}?
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
        {error && (
          <Snackbar>
            <Alert severity="error">
              {error.message || "Something went wrong"}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </Modal>
  );
};

export default ResolvePlayerSupervisionRequestModal;
