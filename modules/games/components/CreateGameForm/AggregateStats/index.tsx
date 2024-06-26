import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import Stat from "./Stat";
import { aggregateStatSchema, AggregateStatsValues } from "./schema";
import { FormValues } from "..";

interface Props {
  values: FormValues;
  goBack: () => void;
  onSubmit: (values: AggregateStatsValues) => void;
}

const AggregateStats: React.FC<Props> = ({ values, goBack, onSubmit }) => {
  const form = useForm<AggregateStatsValues>({
    defaultValues: values,
    values,
    resolver: zodResolver(aggregateStatSchema),
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aggregateStats",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Typography variant="h5">Aggregate stats</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Aggregate stats are stats that are dependent on other stats,
              including other aggregate stats. Right now they can only be of sum
              type, which means that they are the sum of other numerical stats.
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stat
                  genericStats={values}
                  key={field.id}
                  index={index}
                  remove={remove}
                />
              ))}
            </Stack>

            <Button
              onClick={() =>
                append({
                  id: nanoid(),
                  name: "",
                  description: "",
                  orderNumber: 0,
                  references: [],
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
        </Card>
      </form>
    </FormProvider>
  );
};

export default AggregateStats;
