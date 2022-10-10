import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
  useMyPlayersQuery,
  useCreatePlayerMutation,
  MyPlayersDocument,
  MyPlayersQuery,
} from "../../graphql/generated";

const Players = () => {
  const { data, loading, error } = useMyPlayersQuery();
  const players = useMemo(() => data?.me.players, [data]);

  const [newPlayerModalOpen, setNewPlayerModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const [
    createPlayer,
    { loading: createPlayerLoading, error: createPlayerError },
  ] = useCreatePlayerMutation();

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
    setNewPlayerModalOpen(false);
    setNewPlayerName("");
  }, [createPlayer, newPlayerName]);

  return (
    <Box>
      <Typography variant="h3">Introduction</Typography>
      <Typography variant="body1">
        Players are the basic building blocks of you board game statistics.
        Users have a &quot;main player&quot; created for them as soon as they
        register with our app. This player is used to track{" "}
        <Typography sx={{ fontStyle: "italic", display: "inline" }}>
          your
        </Typography>{" "}
        statistics. However, you can create other players for people that
        don&apos;t want to have an account at OBGS. This page is used to manage
        players that you created.
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <Box m={2}>
              <Button
                variant="contained"
                onClick={() => setNewPlayerModalOpen(true)}
              >
                Add new player
              </Button>
            </Box>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Supervisors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <Typography>Loading...</Typography>}
            {players?.length === 0 && (
              <Typography>You have no players yet.</Typography>
            )}
            {players?.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.id}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.supervisors?.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
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

      <Snackbar open={!!error || !!createPlayerError}>
        <Alert severity="error">
          {error?.message ||
            createPlayerError?.message ||
            "Something went wrong"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Players;
