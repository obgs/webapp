import { TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormValues } from "./schema";

interface Props {
  name: string;
}

const NumericStatInput: React.FC<Props> = ({ name }) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <TextField {...field} />}
    />
  );
};

export default NumericStatInput;
