import React from "react";

import EnumStatInput from "./EnumStatInput";
import NumericStatInput from "./NumericStatInput";
import {
  StatDescriptionFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { parseEnumMetadata } from "modules/stats";

interface Props {
  statDescription: StatDescriptionFieldsFragment;
  value: string;
  onChange: (value: string) => void;
}

const StatInput: React.FC<Props> = ({ statDescription, value, onChange }) => {
  switch (statDescription.type) {
    case StatDescriptionStatType.Numeric:
      return (
        <NumericStatInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case StatDescriptionStatType.Enum:
      const metadata = parseEnumMetadata(statDescription.metadata);
      return (
        <EnumStatInput
          metadata={metadata}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default StatInput;
