import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useCallback } from "react";
import * as yup from "yup";

import {
  StatDescriptionStatType,
  useCreateGameMutation,
  SearchGamesDocument,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const minPlayers = 1;
const maxPlayers = 10;

const statsValidation = yup.object({
  name: yup.string().required("Name is required"),
  type: yup.mixed().oneOf(Object.values(StatDescriptionStatType)),
  description: yup.string(),
});

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  minPlayers: yup
    .number()
    .min(minPlayers)
    .required("Minimum players is required"),
  maxPlayers: yup
    .number()
    .max(maxPlayers)
    .required("Maximum players is required"),
  boardgamegeekURL: yup.string().url("Must be a valid URL").optional(),
  statDescriptions: yup.array().of(statsValidation).required(),
});

type FormValues = yup.InferType<typeof validationSchema>;
type StatDescription = yup.InferType<typeof statsValidation>;

const defaultValues: FormValues = {
  name: "",
  description: "",
  minPlayers,
  maxPlayers,
  boardgamegeekURL: "",
  statDescriptions: [
    {
      name: "",
      type: StatDescriptionStatType.Numeric,
      description: "",
    },
  ],
};

const CreateGame = () => {
  const [create, { loading, error }] = useCreateGameMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { handleSubmit, handleChange, setValues, values, errors, touched } =
    useFormik({
      initialValues: defaultValues,
      onSubmit: async () => {
        await create({
          variables: {
            input: {
              name: values.name,
              description: values.description,
              minPlayers: values.minPlayers,
              maxPlayers: values.maxPlayers,
              boardgamegeekURL: values.boardgamegeekURL,
              statDescriptions: values.statDescriptions,
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
      validationSchema,
    });

  const addStat = useCallback(() => {
    setValues({
      ...values,
      statDescriptions: [
        ...values.statDescriptions,
        {
          name: "",
          type: StatDescriptionStatType.Numeric,
          description: "",
        },
      ],
    });
  }, [setValues, values]);

  const removeStat = useCallback(
    (index: number) => () => {
      setValues({
        ...values,
        statDescriptions: values.statDescriptions.filter((_, i) => i !== index),
      });
    },
    [setValues, values]
  );

  return (
    <Container>
      <Typography variant="h4">Create Game</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} alignItems="flex-start">
          <TextField
            label="Name"
            value={values.name}
            name="name"
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
            Stats are the values you want to track. Right now there are only two
            types of stats: numeric and enumerated. Numeric stats are just
            numbers, like the score in a certain category of the game.
            Enumerated stats are values that can be selected from a list, like
            the faction the player played as.
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            {values.statDescriptions.map((stat, index) => (
              <Card sx={{ m: 1 }} key={index}>
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <TextField
                        label="Name"
                        value={stat.name}
                        name={`statDescriptions[${index}].name`}
                        onChange={handleChange}
                        error={
                          touched.statDescriptions &&
                          !!(errors.statDescriptions as StatDescription[])?.[
                            index
                          ]?.name
                        }
                        helperText={
                          touched.statDescriptions &&
                          (errors.statDescriptions as StatDescription[])?.[
                            index
                          ]?.name
                        }
                      />
                      <Select
                        value={stat.type}
                        name={`statDescriptions[${index}].type`}
                        onChange={handleChange}
                      >
                        <MenuItem value={StatDescriptionStatType.Numeric}>
                          Numeric
                        </MenuItem>
                      </Select>
                    </Stack>
                    <TextField
                      label="Description"
                      value={stat.description}
                      name={`statDescriptions[${index}].description`}
                      onChange={handleChange}
                      fullWidth
                      multiline
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <IconButton onClick={removeStat(index)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Stack>
          <IconButton onClick={addStat}>
            <AddCircleIcon />
          </IconButton>

          <LoadingButton variant="contained" loading={loading} type="submit">
            Create
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
};

export default CreateGame;
