import { MenuItem, Select } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormValues } from "./schema";
import { EnumMetadata } from "graphql/generated";

interface Props {
  name: string;
  metadata: EnumMetadata;
}

const EnumStatInput: React.FC<Props> = ({ metadata, name }) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...field}>
          {metadata.possibleValues.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};

export default EnumStatInput;
