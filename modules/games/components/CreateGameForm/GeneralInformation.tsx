import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Label from "./Label";

export const generalInformationSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().optional(),
  minPlayers: z.coerce.number().min(1, "Min players must be at least 1"),
  maxPlayers: z.coerce.number(),
  // https://github.com/colinhacks/zod/issues/310
  boardgamegeekURL: z.string().url().optional().or(z.literal("")),
});

export type GeneralInformationValues = z.infer<typeof generalInformationSchema>;

const refinedSchema = generalInformationSchema
  .refine((data) => data.minPlayers <= data.maxPlayers, {
    message: "Min players must be less than or equal to max players",
    path: ["minPlayers"],
  })
  .refine((data) => data.maxPlayers >= data.minPlayers, {
    message: "Max players must be greater than or equal to min players",
    path: ["maxPlayers"],
  });

interface Props {
  values: GeneralInformationValues;
  onSubmit: (values: GeneralInformationValues) => void;
}

const GeneralInformation: React.FC<Props> = ({ values, onSubmit }) => {
  const {
    register,
    formState: { touchedFields, errors, isValid },
    handleSubmit,
  } = useForm<GeneralInformationValues>({
    values,
    resolver: zodResolver(refinedSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Typography variant="h5">General information</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Label>Name</Label>
          <Grid item xs={8}>
            <TextField
              {...register("name")}
              error={touchedFields.name && !!errors.name}
              helperText={touchedFields.name && errors.name?.message}
              fullWidth
              required
            />
          </Grid>
          <Label>Description</Label>
          <Grid item xs={8}>
            <TextField {...register("description")} multiline fullWidth />
          </Grid>
          <Label>BoardGameGeek URL</Label>
          <Grid item xs={8}>
            <TextField
              {...register("boardgamegeekURL")}
              error={
                !isValid &&
                touchedFields.boardgamegeekURL &&
                !!errors.boardgamegeekURL
              }
              helperText={
                touchedFields.boardgamegeekURL &&
                errors.boardgamegeekURL?.message
              }
              fullWidth
            />
          </Grid>
          <Label>Number of players</Label>
          <Grid item xs={8}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Minimum"
                required
                type="number"
                {...register("minPlayers")}
                error={touchedFields.minPlayers && !!errors.minPlayers}
                helperText={
                  touchedFields.minPlayers && errors.minPlayers?.message
                }
                sx={{ flex: 1 }}
              />
              <TextField
                label="Maximum"
                type="number"
                required
                {...register("maxPlayers")}
                error={touchedFields.maxPlayers && !!errors.maxPlayers}
                helperText={
                  touchedFields.maxPlayers && errors.maxPlayers?.message
                }
                sx={{ flex: 1 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </CardActions>
    </form>
  );
};

export default GeneralInformation;
