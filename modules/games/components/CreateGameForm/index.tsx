import { nanoid } from "nanoid";
import { z } from "zod";

import { aggregateStatSchema } from "./AggregateStats/schema";
import { generalInformationSchema } from "./GeneralInformation";
import { genericStatSchema } from "./GenericStats/schema";
import {
  AggregateMetadataType,
  StatDescriptionInput,
  StatDescriptionStatType,
} from "graphql/generated";

export const validationSchema = generalInformationSchema
  .merge(genericStatSchema)
  .merge(aggregateStatSchema);

export type FormValues = z.infer<typeof validationSchema>;

export const defaultValues: FormValues = {
  name: "",
  description: "",
  minPlayers: 1,
  maxPlayers: 10,
  boardgamegeekURL: "",
  genericStats: [
    {
      id: nanoid(),
      name: "",
      type: StatDescriptionStatType.Numeric,
      description: "",
      possibleValuesInput: "",
      possibleValues: [],
      orderNumber: 0,
    },
  ],
  aggregateStats: [],
};

type AggregateStat = z.infer<
  typeof aggregateStatSchema
>["aggregateStats"][number];
type GenericStat = z.infer<typeof genericStatSchema>["genericStats"][number];

const isAggregateStat = (
  stat: AggregateStat | GenericStat
): stat is AggregateStat => {
  return (stat as unknown as AggregateStat)?.references !== undefined;
};

export const collectStatDescriptions = (
  values: FormValues
): StatDescriptionInput[] => {
  const stats = [...values.genericStats, ...values.aggregateStats].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  return stats.map((stat, index) => {
    if (isAggregateStat(stat)) {
      return {
        name: stat.name,
        type: StatDescriptionStatType.Aggregate,
        description: stat.description,
        orderNumber: index + 1,
        metadata: {
          aggregateMetadata: {
            type: AggregateMetadataType.Sum,
            statOrderNumbers: stat.references.map(
              (reference) => stats.findIndex((s) => s.id === reference) + 1
            ),
          },
        },
      };
    }

    return {
      name: stat.name,
      type: stat.type,
      description: stat.description,
      orderNumber: index + 1,
      metadata:
        stat.type === StatDescriptionStatType.Enum && stat.possibleValues
          ? {
              enumMetadata: {
                possibleValues: stat.possibleValues,
              },
            }
          : undefined,
    };
  });
};
