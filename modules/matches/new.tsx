import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";

import FindPlayerModal from "./components/FindPlayerModal";
import GameAutocomplete from "components/GameAutocomplete";
import {
  GameFieldsFragment,
  PlayerFieldsFragment,
  StatDescriptionStatType,
  useCreateMatchMutation,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";
import { useUser } from "utils/user";

const steps = ["Select game", "Enter stats"];

const CreateMatch = () => {
  const { user } = useUser();

  const [game, setGame] = useState<GameFieldsFragment | null | undefined>();
  const [players, setPlayers] = useState<PlayerFieldsFragment[]>([]);
  const [stats, setStats] = useState<{
    [playerId: string]: {
      [statId: string]: string;
    };
  }>({});

  const createPlayerStats = useCallback(() => {
    return game?.statDescriptions.reduce(
      (acc, d) => ({
        ...acc,
        [d.id]: d.type === StatDescriptionStatType.Numeric ? "0" : "",
      }),
      {}
    ) as Record<string, string>;
  }, [game]);

  // add user's main player to the list of players
  useEffect(() => {
    if (!user?.mainPlayer || players.length || !game) return;
    setPlayers([user.mainPlayer]);
    setStats({
      [user.mainPlayer.id]: createPlayerStats(),
    });
  }, [user, game, players, createPlayerStats]);

  const onGameChange = useCallback((g: GameFieldsFragment) => {
    setGame(g);
  }, []);

  const [activeStep, setActiveStep] = useState(0);

  const [showFindPlayer, setShowFindPlayer] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const addPlayer = useCallback(
    (player: PlayerFieldsFragment) => {
      if (players.find((p) => p.id === player.id)) {
        enqueueSnackbar("Player already present", { variant: "warning" });
        return;
      }
      setPlayers([...players, player]);
      setStats({
        ...stats,
        [player.id]: createPlayerStats(),
      });
      setShowFindPlayer(false);
    },
    [createPlayerStats, enqueueSnackbar, players, stats]
  );

  const [createMatch, { error, loading }] = useCreateMatchMutation();
  useSnackbarError(error);

  const router = useRouter();
  const onSubmit = useCallback(async () => {
    if (!game) return;
    await createMatch({
      variables: {
        input: {
          gameId: game.id,
          playerIds: players.map((p) => p.id),
          stats: Object.entries(stats).flatMap(([playerId, playerStats]) => {
            return Object.entries(playerStats).map(([statId, value]) => ({
              playerId,
              statId,
              value,
            }));
          }),
        },
      },
    });
    enqueueSnackbar("Match created", { variant: "success" });
    router.push("/matches");
  }, [createMatch, enqueueSnackbar, game, players, router, stats]);

  return (
    <Container>
      <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <>
          <GameAutocomplete onChange={onGameChange} sx={{ mb: 2 }} />
          <Button
            onClick={() => setActiveStep(1)}
            variant="contained"
            disabled={!game}
          >
            Continue
          </Button>
        </>
      )}
      {activeStep === 1 && (
        <>
          <Table sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                {game?.statDescriptions.map((d) => (
                  <TableCell key={d.id}>{d.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow hover key={player.id}>
                  <TableCell>
                    {player.id === user?.mainPlayer?.id
                      ? "You"
                      : player.name || player.owner?.name}
                  </TableCell>
                  {game?.statDescriptions.map((d) => (
                    <TableCell key={d.id}>
                      {d.type === StatDescriptionStatType.Numeric && (
                        <TextField
                          value={stats[player.id][d.id]}
                          onChange={(e) =>
                            setStats({
                              ...stats,
                              [player.id]: {
                                ...stats[player.id],
                                [d.id]: e.target.value,
                              },
                            })
                          }
                          size="small"
                          type="number"
                        />
                      )}
                      {d.type === StatDescriptionStatType.Enum &&
                        d.possibleValues && (
                          <Select>
                            {d.possibleValues.map((v) => (
                              <MenuItem key={v}>{v}</MenuItem>
                            ))}
                          </Select>
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  align="right"
                  colSpan={(game?.statDescriptions.length || 0) + 1}
                >
                  <Button
                    variant="contained"
                    onClick={() => setShowFindPlayer(true)}
                  >
                    Add player
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={() => setActiveStep(0)}>Back</Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={onSubmit}
            >
              Create match
            </LoadingButton>
          </Stack>
          <FindPlayerModal
            open={showFindPlayer}
            onClose={() => setShowFindPlayer(false)}
            onConfirm={addPlayer}
          />
        </>
      )}
    </Container>
  );
};

export default CreateMatch;
