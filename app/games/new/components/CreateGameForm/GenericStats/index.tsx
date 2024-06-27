import { zodResolver } from "@hookform/resolvers/zod";
import {
  Divider,
  Button,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import Stat from "./Stat";
import { genericStatSchema, GenericStatsValues } from "./schema";
import { StatDescriptionStatType } from "graphql/generated";

interface Props {
  values: GenericStatsValues;
  goBack: () => void;
  onSubmit: (values: GenericStatsValues) => void;
}

const GenericStats: React.FC<Props> = ({ values, goBack, onSubmit }) => {
  const form = useForm<GenericStatsValues>({
    values,
    resolver: zodResolver(genericStatSchema),
  });
  const { handleSubmit, control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "genericStats",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Typography variant="h5">Generic stats</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Generic stats are stats that are independent from each other. There
            are two types of them available at the moment - numeric and
            enumerable. Numeric stats are stats that can be compared to each
            other, for example, the number of points scored in a game.
            Enumerable stats are the ones that can only be one of a few values,
            for example, the color of a player&apos;s pawn.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Stat key={field.id} index={index} remove={remove} />
            ))}
          </Stack>

          <Button
            onClick={() =>
              append({
                id: nanoid(),
                name: "",
                type: StatDescriptionStatType.Numeric,
                description: "",
                possibleValues: [],
                possibleValuesInput: "",
                orderNumber: 0,
              })
            }
            variant="contained"
            sx={{ mt: 2 }}
          >
            Add stat
          </Button>
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={goBack}>
            Back
          </Button>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </CardActions>
      </form>
    </FormProvider>
  );
};

export default GenericStats;
