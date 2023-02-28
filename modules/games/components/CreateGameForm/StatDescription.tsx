import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useCallback } from "react";

import { StatDescription, StatDescriptionStatType } from "graphql/generated";

import { FormValues } from ".";

interface Props {
  index: number;
  stat: FormValues["statDescriptions"][number];
}

const StatDescription: React.FC<Props> = ({ index, stat }) => {
  const { values, touched, errors, handleChange, setValues } =
    useFormikContext<FormValues>();

  const addPossibleValue = useCallback(
    (i: number) => () => {
      setValues({
        ...values,
        statDescriptions: values.statDescriptions.map((s, j) =>
          i === j
            ? {
                ...s,
                possibleValues: [
                  ...s.possibleValues,
                  values.statDescriptions[j].possibleValuesInput,
                ],
                possibleValuesInput: "",
              }
            : s
        ),
      });
    },
    [setValues, values]
  );

  const removeStat = useCallback(
    (i: number) => () => {
      setValues({
        ...values,
        statDescriptions: values.statDescriptions.filter((_, j) => i !== j),
      });
    },
    [setValues, values]
  );

  const removePossibleValue = useCallback(
    (statIndex: number, valueIndex: number) => () => {
      setValues({
        ...values,
        statDescriptions: values.statDescriptions.map((s, i) =>
          i === statIndex
            ? {
                ...s,
                possibleValues: s.possibleValues.filter(
                  (_: unknown, j: number) => j !== valueIndex
                ),
              }
            : s
        ),
      });
    },
    [setValues, values]
  );

  return (
    <Card sx={{ m: 1, maxWidth: 375 }}>
      <CardContent>
        <Stack spacing={2} alignItems="flex-start" flex={1}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              label="Name"
              value={stat.name}
              name={`statDescriptions[${index}].name`}
              onChange={handleChange}
              error={
                touched.statDescriptions &&
                !!(errors.statDescriptions as StatDescription[])?.[index]?.name
              }
              helperText={
                touched.statDescriptions &&
                (errors.statDescriptions as StatDescription[])?.[index]?.name
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
              <MenuItem value={StatDescriptionStatType.Enum}>
                Enumerable
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
          {stat.type === StatDescriptionStatType.Enum && (
            <>
              <TextField
                label="Possible values"
                value={stat.possibleValuesInput}
                name={`statDescriptions[${index}].possibleValuesInput`}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={addPossibleValue(index)}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
                onChange={handleChange}
              />
              <Stack
                direction="row"
                spacing={0}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {stat.possibleValues.map((value: string, chipIndex: number) => (
                  <Chip
                    key={chipIndex}
                    label={value}
                    onDelete={removePossibleValue(index, chipIndex)}
                  />
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton onClick={removeStat(index)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default StatDescription;
