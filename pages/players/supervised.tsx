import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useMemo, useState } from "react";

import PlayersList from "../../components/players/List";
import {
  useMyPlayersQuery,
  useCreatePlayerMutation,
  MyPlayersQuery,
  MyPlayersDocument,
} from "../../graphql/generated";
import { useSnackbarError } from "utils/apollo";

const Supervised = () => {
  const { data, loading, error } = useMyPlayersQuery();
  const players = useMemo(() => data?.me.players, [data]);

  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const [
    createPlayer,
    { loading: createPlayerLoading, error: createPlayerError },
  ] = useCreatePlayerMutation();
  useSnackbarError(error || createPlayerError);

  const { enqueueSnackbar } = useSnackbar();
  const handleCreatePlayer = useCallback(async () => {
    await createPlayer({
      variables: {
        name: newPlayerName,
      },
      update: (cache, { data: newPlayerData }) => {
        const cached = cache.readQuery<MyPlayersQuery>({
          query: MyPlayersDocument,
        });

        if (!cached?.me.players || !newPlayerData) return;
        cache.writeQuery<MyPlayersQuery>({
          query: MyPlayersDocument,
          data: {
            me: {
              ...cached.me,
              players: [...cached.me.players, newPlayerData.createPlayer],
            },
          },
        });
      },
    });
    enqueueSnackbar(`Player ${newPlayerName} created.`, {
      variant: "success",
    });
    setNewPlayerModalOpen(false);
    setNewPlayerName("");
  }, [createPlayer, enqueueSnackbar, newPlayerName]);

  return (
    <>
      <Typography variant="body1">
        These are players that you are supervising
      </Typography>

      <PlayersList
        players={players}
        loading={loading}
        toolbar={
          <Box m={2}>
            <Button
              variant="contained"
              onClick={() => setNewPlayerModalOpen(true)}
            >
              Add new player
            </Button>
          </Box>
        }
      />
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={newPlayerModalOpen}
        onClose={() => setNewPlayerModalOpen(false)}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "10px",
            p: 3,
          }}
        >
          <Box mb={2}>
            <TextField
              variant="outlined"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              label="Player name"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Button onClick={() => setNewPlayerModalOpen(false)}>Cancel</Button>
            <LoadingButton
              variant="contained"
              loading={createPlayerLoading}
              onClick={handleCreatePlayer}
            >
              Create
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Supervised;
