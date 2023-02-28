import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { Identifier } from "dnd-core";
import { useFormikContext } from "formik";
import React, { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { StatDescription, StatDescriptionStatType } from "graphql/generated";

import { FormValues } from ".";

interface Props {
  index: number;
  stat: FormValues["statDescriptions"][number];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
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
        statDescriptions: values.statDescriptions
          .filter((_, j) => i !== j)
          .map((s) =>
            s.type === StatDescriptionStatType.Aggregate
              ? {
                  ...s,
                  aggregateOrderNumbers: s.aggregateOrderNumbers.filter(
                    (n: number) => n !== i
                  ),
                }
              : s
          ),
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

  const handleAggregateStatsChange = useCallback(
    (i: number) => (e: SelectChangeEvent<number[]>) => {
      if (typeof e.target.value === "string") return;
      setValues({
        ...values,
        statDescriptions: values.statDescriptions.map((s, j) =>
          i === j
            ? {
                ...s,
                aggregateOrderNumbers: e.target.value,
              }
            : s
        ),
      });
    },
    [setValues, values]
  );

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newStats = [...values.statDescriptions];
      [newStats[dragIndex], newStats[hoverIndex]] = [
        newStats[hoverIndex],
        newStats[dragIndex],
      ];

      setValues({
        ...values,
        statDescriptions: newStats,
      });
    },
    [setValues, values]
  );

  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "stat",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "stat",
    item: () => {
      return { id: stat.name, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Card sx={{ m: 1, maxWidth: 375, opacity: isDragging ? 0.5 : 1 }} ref={ref}>
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
              <MenuItem value={StatDescriptionStatType.Aggregate}>
                Aggregate
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
                {stat.possibleValues?.map(
                  (value: string | undefined, chipIndex: number) => (
                    <Chip
                      key={chipIndex}
                      label={value}
                      onDelete={removePossibleValue(index, chipIndex)}
                    />
                  )
                )}
              </Stack>
            </>
          )}
          {stat.type === StatDescriptionStatType.Aggregate && (
            <Select
              value={stat.aggregateOrderNumbers}
              renderValue={(selected) =>
                selected
                  .map((i) => values.statDescriptions[i - 1].name)
                  .join(",")
              }
              onChange={handleAggregateStatsChange(index)}
              input={<OutlinedInput />}
              multiple
              fullWidth
            >
              {values.statDescriptions.map((s, i) => (
                <MenuItem
                  key={i}
                  value={i + 1}
                  sx={{
                    display:
                      s.type !== StatDescriptionStatType.Numeric
                        ? "none"
                        : undefined,
                  }}
                >
                  <Checkbox
                    checked={values.statDescriptions[
                      index
                    ].aggregateOrderNumbers.includes(i + 1)}
                  />
                  <ListItemText primary={s.name} />
                </MenuItem>
              ))}
            </Select>
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
