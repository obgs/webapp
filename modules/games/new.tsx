import { LoadingButton } from "@mui/lab";
import { Container, Slider, Stack, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useCallback } from "react";

import {
  defaultValues,
  FormValues,
  validationSchema,
} from "./components/CreateGameForm";
import AddStat from "./components/CreateGameForm/AddStat";
import StatDescription from "./components/CreateGameForm/StatDescription";
import {
  SearchGamesDocument,
  StatDescriptionInput,
  StatDescriptionStatType,
  useCreateGameMutation,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const CreateGame = () => {
  const [create, { loading, error }] = useCreateGameMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: FormValues) => {
      await create({
        variables: {
          input: {
            name: values.name,
            description: values.description,
            minPlayers: values.minPlayers,
            maxPlayers: values.maxPlayers,
            boardgamegeekURL: values.boardgamegeekURL,
            statDescriptions: values.statDescriptions.map(
              (stat): StatDescriptionInput => ({
                name: stat.name,
                type: stat.type,
                description: stat.description,
                metadata:
                  stat.type === StatDescriptionStatType.Enum
                    ? {
                        enumMetadata: {
                          possibleValues: stat.possibleValues,
                        },
                      }
                    : undefined,
              })
            ),
          },
        },
        refetchQueries: [
          {
            query: SearchGamesDocument,
            variables: { where: { nameContains: "" }, first: 10 },
          },
        ],
      });
      enqueueSnackbar(`Game ${values.name} created`, { variant: "success" });
      router.push("/games");
    },
    [create, enqueueSnackbar, router]
  );

  return (
    <Container>
      <Typography variant="h4">Create Game</Typography>
      <Formik
        onSubmit={onSubmit}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {({ values, touched, errors, setValues, handleChange }) => (
          <Form>
            <Stack spacing={2} alignItems="flex-start">
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <TextField
                label="Description"
                value={values.description}
                name="description"
                onChange={handleChange}
                multiline
                sx={{ width: 400 }}
              />
              <TextField
                label="Boardgamegeek URL"
                value={values.boardgamegeekURL}
                name="boardgamegeekURL"
                onChange={handleChange}
                error={touched.boardgamegeekURL && !!errors.boardgamegeekURL}
                helperText={touched.boardgamegeekURL && errors.boardgamegeekURL}
              />
              <Typography>Amount of players</Typography>
              <Slider
                size="small"
                marks
                valueLabelDisplay="auto"
                min={1}
                max={10}
                value={[values.minPlayers, values.maxPlayers]}
                onChange={(_, value) => {
                  if (typeof value === "number") return;
                  setValues({
                    ...values,
                    minPlayers: value[0],
                    maxPlayers: value[1],
                  });
                }}
              />
              <Typography variant="body1">Stats</Typography>
              <Typography variant="body2">
                Stats are the values you want to track. Right now there are only
                two types of stats: numeric and enumerated. Numeric stats are
                just numbers, like the score in a certain category of the game.
                Enumerated stats are values that can be selected from a list,
                like the faction the player played as.
              </Typography>
              <Stack direction="column">
                {values.statDescriptions.map((stat, index) => (
                  <StatDescription index={index} key={index} stat={stat} />
                ))}
              </Stack>
              <AddStat />

              <LoadingButton
                variant="contained"
                loading={loading}
                type="submit"
              >
                Create
              </LoadingButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreateGame;
