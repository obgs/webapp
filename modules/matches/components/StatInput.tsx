import React from "react";

import AggregateStatValue from "./AggregateStatValue";
import EnumStatInput from "./EnumStatInput";
import NumericStatInput from "./NumericStatInput";
import {
  StatDescriptionFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { parseAggregateMetadata, parseEnumMetadata } from "modules/stats";

interface Props {
  statDescription: StatDescriptionFieldsFragment;
  playerId: string;
}

const StatInput: React.FC<Props> = ({ statDescription, playerId }) => {
  const name = `${playerId}.${statDescription.id}`;
  switch (statDescription.type) {
    case StatDescriptionStatType.Numeric:
      return <NumericStatInput name={name} />;
    case StatDescriptionStatType.Enum: {
      if (!statDescription.metadata) return null;
      const metadata = parseEnumMetadata(statDescription.metadata);
      return <EnumStatInput metadata={metadata} name={name} />;
    }
    case StatDescriptionStatType.Aggregate: {
      if (!statDescription.metadata) return null;
      const metadata = parseAggregateMetadata(statDescription.metadata);
      return <AggregateStatValue metadata={metadata} playerId={playerId} />;
    }
  }
};

export default StatInput;
