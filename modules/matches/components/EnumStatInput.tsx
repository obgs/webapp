import { MenuItem, Select, SelectProps } from "@mui/material";
import React from "react";

import { EnumMetadata } from "graphql/generated";

interface Props extends SelectProps<string> {
  metadata: EnumMetadata;
}

const EnumStatInput: React.FC<Props> = ({ metadata, ...props }) => {
  return (
    <Select {...props}>
      {metadata.possibleValues.map((v) => (
        <MenuItem key={v} value={v}>
          {v}
        </MenuItem>
      ))}
    </Select>
  );
};

export default EnumStatInput;
