import { Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormValues } from "./schema";
import { AggregateMetadata } from "graphql/generated";

interface Props {
  playerId: string;
  metadata: AggregateMetadata;
}

const AggregateStatValue: React.FC<Props> = ({ playerId, metadata }) => {
  const { control } = useFormContext<FormValues>();

  const fieldNames = useMemo(
    () => metadata.statIds.map((id) => `${playerId}.${id}`),
    [metadata, playerId]
  );

  const values = useWatch({
    control,
    name: fieldNames,
  });

  const value = useMemo(
    () => values.reduce((acc, v) => acc + Number(v), 0),
    [values]
  );

  return <Typography>{value}</Typography>;
};

export default AggregateStatValue;
