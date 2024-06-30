import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { AggregateStatsValues } from "./schema";
import { GenericStatsValues } from "../GenericStats/schema";
import Label from "../Label";
import { StatDescriptionStatType } from "graphql/generated";

interface Props {
  index: number;
  genericStats: GenericStatsValues;
  remove: (index: number) => void;
}

const Stat: React.FC<Props> = ({ index, genericStats, remove }) => {
  const {
    control,
    formState: { touchedFields, errors },
  } = useFormContext<AggregateStatsValues>();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Label>Name *</Label>
          <Grid item xs={8}>
            <Controller
              control={control}
              name={`aggregateStats.${index}.name`}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={
                    touchedFields.aggregateStats &&
                    !!errors.aggregateStats?.[index]?.name
                  }
                  helperText={
                    touchedFields.aggregateStats &&
                    errors.aggregateStats?.[index]?.name?.message
                  }
                  fullWidth
                  data-cy="nameAggStat"
                />
              )}
            />
          </Grid>

          <Label>Description</Label>
          <Grid item xs={8}>
            <Controller
              control={control}
              name={`aggregateStats.${index}.description`}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  data-cy="descAggStat"
                />
              )}
            />
          </Grid>
          <Label>Stats *</Label>
          <Grid item xs={8}>
            <Controller
              control={control}
              name={`aggregateStats.${index}.references`}
              defaultValue={[]}
              render={({ field }) => (
                <Select multiple {...field} fullWidth data-cy="dropListStat">
                  {genericStats.genericStats
                    .filter((s) => s.type === StatDescriptionStatType.Numeric)
                    .map((stat) => (
                      <MenuItem value={stat.id} key={stat.id}>
                        {stat.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Stat;
