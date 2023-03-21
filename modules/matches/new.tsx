import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import FindPlayerModal from "./components/FindPlayerModal";
import StatInput from "./components/StatInput";
import { FormValues, schema } from "./components/schema";
import GameAutocomplete from "components/GameAutocomplete";
import {
  GameFieldsFragment,
  PlayerFieldsFragment,
  StatDescriptionStatType,
  useCreateMatchMutation,
  StatInput as StatInputType,
} from "graphql/generated";
import { parseEnumMetadata } from "modules/stats";
import { useSnackbarError } from "utils/apollo";
import { useUser } from "utils/user";

const steps = ["Select game", "Enter stats"];

const CreateMatch = () => {
  const { user } = useUser();

  const [game, setGame] = useState<GameFieldsFragment | null | undefined>();
  const [players, setPlayers] = useState<PlayerFieldsFragment[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {},
    resolver: zodResolver(schema),
  });

  const { setValue, handleSubmit } = form;

  const createPlayerStats: () => Record<string, string> = useCallback(
    () =>
      game?.statDescriptions.reduce((acc, d) => {
        // aggregate stats are not editable and are calculated automatically on the server
        if (d.type === StatDescriptionStatType.Aggregate) return acc;
        return {
          ...acc,
          [d.id]:
            d.type === StatDescriptionStatType.Numeric
              ? "0"
              : d.type === StatDescriptionStatType.Enum && d.metadata
              ? parseEnumMetadata(d.metadata).possibleValues[0]
              : "",
        };
      }, {}) ?? {},
    [game]
  );

  // add user's main player to the list of players
  useEffect(() => {
    if (!user?.mainPlayer || players.length || !game) return;
    setPlayers([user.mainPlayer]);
    setValue(user.mainPlayer.id, createPlayerStats());
  }, [user, game, players, createPlayerStats, setValue]);

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
      setValue(player.id, createPlayerStats());
      setShowFindPlayer(false);
    },
    [createPlayerStats, enqueueSnackbar, players, setValue]
  );

  const [createMatch, { error, loading }] = useCreateMatchMutation();
  useSnackbarError(error);

  const router = useRouter();
  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (!game) return;
      await createMatch({
        variables: {
          input: {
            gameId: game.id,
            playerIds: players.map((p) => p.id),
            stats: Object.entries(values).flatMap(
              ([playerId, playerStats]): StatInputType[] => {
                return Object.entries(playerStats).map(
                  ([statId, value]): StatInputType => ({
                    playerId,
                    statId,
                    value,
                  })
                );
              }
            ),
          },
        },
      });
      enqueueSnackbar("Match created", { variant: "success" });
      router.push("/matches");
    },
    [createMatch, enqueueSnackbar, game, players, router]
  );

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
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                        <StatInput statDescription={d} playerId={player.id} />
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
                type="submit"
              >
                Create match
              </LoadingButton>
            </Stack>
            <FindPlayerModal
              open={showFindPlayer}
              onClose={() => setShowFindPlayer(false)}
              onConfirm={addPlayer}
            />
          </form>
        </FormProvider>
      )}
    </Container>
  );
};

export default CreateMatch;
