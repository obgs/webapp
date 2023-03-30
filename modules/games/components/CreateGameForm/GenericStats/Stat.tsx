import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { GenericStatsValues } from "./schema";
import { StatDescriptionStatType } from "graphql/generated";

interface Props {
  index: number;
  remove: (index: number) => void;
}

const Stat: React.FC<Props> = ({ index, remove }) => {
  const {
    register,
    control,
    formState: { touchedFields, errors },
    setValue,
    watch,
  } = useFormContext<GenericStatsValues>();
  const type = watch(`genericStats.${index}.type`);
  const possibleValues = watch(`genericStats.${index}.possibleValues`);
  const possibleValuesInput = watch(
    `genericStats.${index}.possibleValuesInput`
  );

  const addPossibleValue = useCallback(() => {
    if (possibleValuesInput) {
      setValue(`genericStats.${index}.possibleValues`, [
        ...possibleValues,
        possibleValuesInput,
      ]);
      setValue(`genericStats.${index}.possibleValuesInput`, "");
    }
  }, [index, possibleValues, possibleValuesInput, setValue]);

  const removePossibleValue = useCallback(
    (i: number) => {
      const newPossibleValues = [...possibleValues];
      newPossibleValues.splice(i, 1);
      setValue(`genericStats.${index}.possibleValues`, newPossibleValues);
    },
    [index, possibleValues, setValue]
  );

  return (
    <Card sx={{ m: 1 }}>
      <CardContent>
        <Stack spacing={2} alignItems="flex-start" flex={1}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={8}>
              <TextField
                label="Name"
                {...register(`genericStats.${index}.name`)}
                error={
                  touchedFields.genericStats &&
                  !!errors.genericStats?.[index]?.name
                }
                helperText={
                  touchedFields.genericStats &&
                  errors.genericStats?.[index]?.name?.message
                }
                fullWidth
                data-cy='nameStat'
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                control={control}
                name={`genericStats.${index}.type`}
                defaultValue={StatDescriptionStatType.Numeric}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onChange={onChange} fullWidth data-cy='typeStat'>
                    <MenuItem value={StatDescriptionStatType.Numeric}>
                      Numeric
                    </MenuItem>
                    <MenuItem value={StatDescriptionStatType.Enum}>
                      Enumerable
                    </MenuItem>
                  </Select>
                )}
              />
            </Grid>
          </Grid>
          <TextField
            label="Description"
            {...register(`genericStats.${index}.description`)}
            fullWidth
            multiline
            data-cy='descStat'
          />
          {type === StatDescriptionStatType.Enum && (
            <>
              <TextField
                label="Possible values"
                {...register(`genericStats.${index}.possibleValuesInput`)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={addPossibleValue} data-cy='plusStat'>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
                data-cy='valuesStat'
              />
              <Stack
                direction="row"
                spacing={0}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {possibleValues.map((value, chipIndex) => (
                  <Chip
                    key={`possibleValue-${chipIndex}`}
                    label={value}
                    onDelete={() => removePossibleValue(chipIndex)}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
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
