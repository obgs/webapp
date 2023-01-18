import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

const NumericStatInput: React.FC<Omit<TextFieldProps, "size" | "type">> = (
  props
) => {
  return <TextField {...props} />;
};

export default NumericStatInput;
