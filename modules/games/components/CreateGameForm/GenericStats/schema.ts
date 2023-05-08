import { z } from "zod";

import { StatDescriptionStatType } from "graphql/generated";

export const genericStatSchema = z.object({
  genericStats: z
    .array(
      z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty("Name is required"),
        type: z.nativeEnum(StatDescriptionStatType),
        description: z.string().optional(),
        possibleValuesInput: z.string().optional(),
        possibleValues: z.array(z.string()),
        orderNumber: z.number(),
      })
    )
    .min(1),
});
export type GenericStatsValues = z.infer<typeof genericStatSchema>;
